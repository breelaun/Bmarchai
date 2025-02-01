import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { stripe } from '../_utils/stripe.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { supabaseClient } from '../_shared/supabase-client.ts'

console.log('Loading create-checkout function...')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, vendorId, mode, successUrl, cancelUrl } = await req.json()

    if (!amount || !vendorId) {
      throw new Error('Missing required parameters')
    }

    console.log('Creating checkout session:', { amount, vendorId, mode })

    // Calculate commission (5%)
    const commissionRate = 0.05
    const commissionAmount = amount * commissionRate
    const vendorPayoutAmount = amount - commissionAmount

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Payment',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: mode || 'payment',
      success_url: successUrl || 'http://localhost:5173/payment/success',
      cancel_url: cancelUrl || 'http://localhost:5173/payment/cancel',
      metadata: {
        vendorId,
        commissionAmount,
        vendorPayoutAmount,
      },
    })

    // Create payment transaction record
    const { error: transactionError } = await supabaseClient
      .from('payment_transactions')
      .insert({
        vendor_id: vendorId,
        amount: amount,
        commission_amount: commissionAmount,
        vendor_payout_amount: vendorPayoutAmount,
        provider: 'stripe',
        provider_transaction_id: session.id,
        status: 'pending',
      })

    if (transactionError) {
      console.error('Transaction record error:', transactionError)
      // Continue with checkout even if transaction record fails
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Checkout error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    )
  }
})