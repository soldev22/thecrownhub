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

  const body = await req.json();
  const { type, date, chairNumber, hours, amount } = body;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    return NextResponse.json({ error: 'Missing NEXT_PUBLIC_APP_URL' }, { status: 500 });
  }

  try {
    let params: Stripe.Checkout.SessionCreateParams;

    if (type === 'popup') {
      if (!date || !hours || !amount) {
        return NextResponse.json({ error: 'Missing fields for pop-up booking' }, { status: 400 });
      }

      params = {
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              unit_amount: amount, // total in pence (e.g. 3000 for £30)
              product_data: {
                name: `Pop-Up Booking – ${hours} hour(s) on ${date} (The Crown Hub)`,
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
          hours: hours.toString(),
          bookingType: 'popup',
        },
      };
    } else if (type === 'chair') {
      if (!date || !chairNumber) {
        return NextResponse.json({ error: 'Missing fields for chair booking' }, { status: 400 });
      }

      params = {
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              unit_amount: 1500, // £15 per day
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
          bookingType: 'chair',
        },
      };
    } else {
      return NextResponse.json({ error: 'Invalid booking type' }, { status: 400 });
    }

    const stripeSession = await stripe.checkout.sessions.create(params);
    return NextResponse.json({ url: stripeSession.url });

  } catch (err) {
    console.error('🔥 Stripe session error:', err);
    return NextResponse.json({ error: 'Stripe session error' }, { status: 500 });
  }
}
