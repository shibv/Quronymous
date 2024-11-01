import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  await connectToDatabase();

  try {
    const { username } = await req.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
    }

    const uniqueId = uuidv4();
    const user = new User({ username, uniqueId });
    await user.save();

    return NextResponse.json({ uniqueId });
  } catch (error) {
    console.error('Error in generate-link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
