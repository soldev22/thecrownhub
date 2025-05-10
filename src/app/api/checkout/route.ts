import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import stripe from '@/lib/stripe';

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
    console.error('❌ Missing NEXT_PUBLIC_APP_URL env var');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: 100,
            product_data: {
              name: `Chair Booking - Chair ${chairNumber} on ${date}`,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/booking/success`,
      cancel_url: `${baseUrl}/booking/cancel`,
      metadata: {
        userId: session.user.id,
        date,
        chairNumber,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (err) {
    console.error('🔥 Stripe session error:', err);
    return NextResponse.json({ error: 'Stripe session error' }, { status: 500 });
  }
}
