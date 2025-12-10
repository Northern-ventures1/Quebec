import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/db/client';

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'cad', itemId, buyerId } = await request.json();

    if (!amount || !itemId || !buyerId) {
      return NextResponse.json(
        { error: 'Amount, item ID, and buyer ID are required' },
        { status: 400 }
      );
    }

    // Get marketplace item
    const { data: item, error: itemError } = await supabaseAdmin
      .from('marketplace_items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (itemError || !item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        itemId,
        buyerId,
        sellerId: item.seller_id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create order record
    await supabaseAdmin.from('orders').insert({
      buyer_id: buyerId,
      seller_id: item.seller_id,
      item_id: itemId,
      quantity: 1,
      total_price: amount,
      payment_intent_id: paymentIntent.id,
      status: 'pending',
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Payment intent error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
