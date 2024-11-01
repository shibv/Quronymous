'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ViewMessages() {
  const [username, setUsername] = useState('')
  const [messages, setMessages] = useState([])

  const fetchMessages = async () => {
    if (!username.trim()) {
      toast.error('Please enter a username')
      return
    }

    try {
      const response = await fetch(`/api/get-messages?username=${encodeURIComponent(username)}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const data = await response.json()
      setMessages(data.messages)

      if (data.messages.length === 0) {
        toast.info('No messages found for this username')
      }
    } catch (error) {
      toast.error('Failed to fetch messages. Please try again.')
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>View Your Messages</CardTitle>
          <CardDescription>Enter your username to see your anonymous messages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button onClick={fetchMessages} className="w-full">Fetch Messages</Button>
          {messages.length > 0 && (
            <ul className="space-y-2 mt-4">
              {messages.map((message, index) => (
                <li key={index} className="bg-secondary p-2 rounded">
                  {message}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  )
}