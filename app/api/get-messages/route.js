import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Message from '@/models/Message';

export async function GET(req) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const messages = await Message.find({ username }).sort({ createdAt: -1 }).exec();

    return NextResponse.json({ messages: messages.map((msg) => msg.message) });
  } catch (error) {
    console.error('Error in get-messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
