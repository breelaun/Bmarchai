import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { payoutId } = await req.json();

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get the user from the authorization header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Fetch the payout record
    const { data: payout, error: payoutError } = await supabaseClient
      .from('vendor_payouts')
      .select('*, vendor_profiles(*)')
      .eq('id', payoutId)
      .single();

    if (payoutError || !payout) {
      throw new Error('Payout not found');
    }

    // Verify the user is the vendor
    if (payout.vendor_id !== user.id) {
      throw new Error('Unauthorized');
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Create Stripe payout
    const stripePayout = await stripe.payouts.create({
      amount: Math.round(payout.amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        vendor_id: payout.vendor_id,
        payout_id: payout.id,
      }
    });

    // Update payout record with Stripe payout ID and status
    const { error: updateError } = await supabaseClient
      .from('vendor_payouts')
      .update({
        status: 'processing',
        provider_payout_id: stripePayout.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payoutId);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        message: 'Payout processing initiated',
        payout: stripePayout 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});