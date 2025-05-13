import { connectDB } from "@/lib/db";
import { PopupBooking } from "@/lib/models/PopupBooking";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  await PopupBooking.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
