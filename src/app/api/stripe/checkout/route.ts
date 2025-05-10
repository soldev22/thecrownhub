import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/lib/stripe/client';

export async function POST(req: NextRequest) {
  const { date, chairNumber } = await req.json();

  if (!date || !chairNumber) {
    return NextResponse.json({ error: 'Invalid booking data' }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Chair Booking - ${date} (Chair ${chairNumber})`,
          },
          unit_amount: 100, // £15.00
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,

  });

  return NextResponse.json({ url: session.url });
}
