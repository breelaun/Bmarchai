import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { stripe } from '../_utils/stripe.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { supabaseClient } from '../_shared/supabase-client.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, vendorId, paymentMethod } = await req.json()

    if (!amount || !vendorId) {
      throw new Error('Missing required parameters')
    }

    // If cash payment, just create a record and return success
    if (paymentMethod === 'cash') {
      const { error } = await supabaseClient
        .from('payment_transactions')
        .insert({
          vendor_id: vendorId,
          amount,
          payment_method: 'cash',
          status: 'pending'
        })

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, message: 'Cash payment recorded' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // For card payments, create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Purchase',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment/success`,
      cancel_url: `${req.headers.get('origin')}/payment/cancel`,
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})