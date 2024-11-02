'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, MessageCircle, ThumbsUp, ThumbsDown } from 'lucide-react'

export default function ViewMessages() {
  const [username, setUsername] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchMessages = async () => {
    if (!username.trim()) {
      toast.error('Please enter a username')
      return
    }

    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <MessageCircle className="h-6 w-6 mr-2 text-primary" />
              View Your Messages
            
            </CardTitle>
            <CardDescription>Enter your username to see your anonymous messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button onClick={fetchMessages} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="sr-only">Fetch Messages</span>
              </Button>
            </div>
            <AnimatePresence>
              {messages.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 mt-4"
                >
                  {messages.map((message, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-secondary p-4 rounded-lg"
                    >
                      <div className="flex items-start space-x-3">
                        <MessageCircle className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                        <div className="flex-grow">
                          <p className="text-sm">{message}</p>
                          <div className="mt-2 flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              Like
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              Dislike
                            </Button>
                            <Button variant="ghost" size="sm">
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
      <ToastContainer position="top-center" />
    </div>
  )
}