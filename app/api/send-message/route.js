import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Message from '@/models/Message'

export async function POST(req) {
  await dbConnect()

  const { id, message } = await req.json()

  if (!id || !message) {
    return NextResponse.json({ error: 'ID and message are required' }, { status: 400 })
  }

  try {
    const user = await User.findOne({ uniqueLink: { $regex: id, $options: 'i' } })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const newMessage = new Message({
      content: message,
      recipient: user._id,
    })

    await newMessage.save()

    return NextResponse.json({ message: 'Message sent successfully' })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}