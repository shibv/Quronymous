import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Message from '@/models/Message';

export async function POST(req) {
  await connectToDatabase();

  try {
    const { id, message } = await req.json();

    if (!id || !message || typeof id !== 'string' || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const user = await User.findOne({ uniqueId: id });
    if (!user) {
      return NextResponse.json({ error: 'Invalid link' }, { status: 400 });
    }

    const newMessage = new Message({ username: user.username, message });
    await newMessage.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in send-message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
