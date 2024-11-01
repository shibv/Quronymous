'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function SendMessage() {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const params = useParams()
  const { id } = params

  const sendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    setIsSending(true); // Indicate sending in progress
    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, message }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      toast.success('Message sent successfully!')
      setMessage('') // Clear the message input

    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSending(false); // Reset sending state regardless of success or error
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Send Anonymous Message</CardTitle>
          <CardDescription>Your message will be sent anonymously</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Type your anonymous message here"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              // Reset sending state if the user types a new message
              if (isSending) {
                setIsSending(false);
              }
            }}
            rows={4}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={sendMessage} className="w-full" disabled={isSending}>
            {isSending ? 'Sending...' : 'Send Message'}
          </Button>
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>
  )
}
