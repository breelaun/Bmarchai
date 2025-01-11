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
        const { error } = await supabaseClient
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

        if (error) {
          console.error('Error updating payment transaction:', error);
          throw error;
        }

        console.log('Payment transaction updated successfully');
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

      // Add more event types as needed
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