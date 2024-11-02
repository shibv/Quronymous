import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { v4 as uuidv4 } from 'uuid'
import { sign } from 'jsonwebtoken'
import { serialize } from 'cookie'

export async function POST(req) {
  await dbConnect()

  const { name } = await req.json()

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  try {
    const username = `user_${uuidv4().slice(0, 8)}`
    const password = uuidv4().slice(0, 8)
    const hashedPassword = await bcrypt.hash(password, 10)
    const uniqueLink = `${process.env.NEXT_PUBLIC_BASE_URL}/send/${uuidv4()}`

    const user = new User({
      name,
      username,
      password: hashedPassword,
      uniqueLink,
    })

    await user.save()

    // Generate JWT token
    const token = sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    // Serialize the token into a cookie
    const serialized = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    })

    // Return the user data and set the cookie
    return NextResponse.json(
      { username, uniqueLink, password: password },
      { 
        status: 200,
        headers: { 'Set-Cookie': serialized }
      }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}