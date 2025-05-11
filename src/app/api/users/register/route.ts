import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { hashPassword } from '@/lib/utils/hash';

export async function POST(req: NextRequest) {
  const { name, email, password, mobile, company } = await req.json();

  if (!name || !email || !password || !mobile) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    mobile,
    company: company || '',
  });

  return NextResponse.json({ message: 'User registered', userId: newUser._id });
}
