import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No Stripe signature found');
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured');
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log('Processing webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Update payment transaction status
        const { error: transactionError } = await supabaseClient
          .from('payment_transactions')
          .update({ 
            status: 'completed',
            updated_at: new Date().toISOString(),
            metadata: {
              ...session,
              stripe_event_type: event.type
            }
          })
          .eq('provider_transaction_id', session.id);

        if (transactionError) {
          console.error('Error updating payment transaction:', transactionError);
          throw transactionError;
        }

        // Get the payment transaction to create vendor payout
        const { data: transaction, error: fetchError } = await supabaseClient
          .from('payment_transactions')
          .select('*')
          .eq('provider_transaction_id', session.id)
          .single();

        if (fetchError) {
          console.error('Error fetching payment transaction:', fetchError);
          throw fetchError;
        }

        if (transaction) {
          // Create vendor payout record
          const { error: payoutError } = await supabaseClient
            .from('vendor_payouts')
            .insert({
              vendor_id: transaction.vendor_id,
              amount: transaction.vendor_payout_amount,
              status: 'pending',
              provider: 'stripe',
              provider_payout_id: null, // Will be updated when actual payout is created
            });

          if (payoutError) {
            console.error('Error creating vendor payout:', payoutError);
            throw payoutError;
          }
        }

        console.log('Payment transaction and payout records updated successfully');
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        
        // Update payment transaction status for refund
        const { error } = await supabaseClient
          .from('payment_transactions')
          .update({ 
            status: 'refunded',
            updated_at: new Date().toISOString(),
            metadata: {
              ...charge,
              stripe_event_type: event.type
            }
          })
          .eq('provider_transaction_id', charge.payment_intent);

        if (error) {
          console.error('Error updating payment transaction for refund:', error);
          throw error;
        }

        console.log('Payment transaction updated for refund');
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});