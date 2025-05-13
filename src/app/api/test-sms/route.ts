import { NextRequest, NextResponse } from 'next/server';
import { sendSMS } from '@/lib/sms';

export async function GET(req: NextRequest) {
    try {
        // Replace this with your test number
        const to = '+447739870670'; 
        const message = '📩 This is a test SMS from your CrownHub booking system! - After Payment';

        const response = await sendSMS({ to, message });

        return NextResponse.json({
            success: true,
            message: 'Test SMS sent successfully.',
            details: response,
        });
    } catch (error: any) {
        console.error('SMS Test Failed:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Unknown error' },
            { status: 500 }
        );
    }
}