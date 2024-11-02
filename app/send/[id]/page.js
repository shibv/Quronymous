'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion } from 'framer-motion'
import { Send, Loader2, MessageCircle, Smile } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'

export default function SendMessage() {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false) // Emoji picker visibility state
  const params = useParams()
  const { id } = params

  const sendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    setIsSending(true)
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
      setMessage('')
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const onEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji) // Append selected emoji to message
  }

  const addSticker = (sticker) => {
    setMessage((prev) => prev + ` ${sticker} `) // Append selected sticker to message
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <MessageCircle className="h-6 w-6 mr-2 text-primary" />
              Send Anonymous Message
            </CardTitle>
            <CardDescription>Your message will be sent anonymously to the recipient</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type your anonymous message or question here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <Smile className="h-5 w-5" />
                Emoji
              </Button>
              <Button variant="outline" onClick={() => addSticker('🌟')}>
                🌟 Sticker
              </Button>
              <Button variant="outline" onClick={() => addSticker('🔥')}>
                🔥 Sticker
              </Button>
            </div>
            {showEmojiPicker && (
              <div className="emoji-picker">
                <EmojiPicker onEmojiClick={(emojiObject) => onEmojiClick(emojiObject)} />
              </div>
            )}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Tips:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Be respectful and constructive in your message</li>
                <li>Ask open-ended questions to encourage thoughtful responses</li>
                <li>Avoid sharing personal information</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={sendMessage} 
              className="w-full" 
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      <ToastContainer position="bottom-center" />
    </div>
  )
}
