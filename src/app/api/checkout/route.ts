import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import stripe from '@/lib/stripe';
import type Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { date, chairNumber } = await req.json();

  if (!date || !chairNumber) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    return NextResponse.json({ error: 'Missing NEXT_PUBLIC_APP_URL' }, { status: 500 });
  }

  try {
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: 50, // £15.00 in pence
            product_data: {
              name: `Chair Booking – Chair ${chairNumber} on ${date} (The Crown Hub)`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/payment/success`,
      cancel_url: `${baseUrl}/payment/cancel`,
      metadata: {
        userId: session.user.id?.toString() ?? '',
        date,
        chairNumber: chairNumber.toString(),
      },
    };

    const stripeSession = await stripe.checkout.sessions.create(params);
    return NextResponse.json({ url: stripeSession.url });
  } catch (err) {
    console.error('🔥 Stripe session error:', err);
    return NextResponse.json({ error: 'Stripe session error' }, { status: 500 });
  }
}
