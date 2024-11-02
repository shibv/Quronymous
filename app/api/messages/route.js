import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import dbConnect from '@/lib/mongodb'
import Message from '@/models/Message'

export async function GET(req) {
  await dbConnect()

  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET)
    const messages = await Message.find({ recipient: decoded.userId }).sort({ createdAt: -1 })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}