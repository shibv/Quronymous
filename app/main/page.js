'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Copy, LogOut, Key } from 'lucide-react'

export default function Main() {
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user')
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        toast.error('Failed to load user data. Please login again.')
        router.push('/login')
      }
    }

    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages')
        if (!response.ok) {
          throw new Error('Failed to fetch messages')
        }
        const messageData = await response.json()
        setMessages(messageData)
      } catch (error) {
        toast.error('Failed to load messages')
      }
    }

    fetchUserData()
    fetchMessages()
  }, [router])

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(user.uniqueLink)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link'))
  }

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(user.password)
      .then(() => toast.success('Password copied to clipboard!'))
      .catch(() => toast.error('Failed to copy password'))
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span>Welcome, {user.name}</span>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardTitle>
            <CardDescription>Your Quronymous Information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold">Your unique link:</p>
              <p className="break-all text-sm bg-secondary p-2 rounded">{user.uniqueLink}</p>
              <Button onClick={copyLinkToClipboard} variant="outline" className="mt-2">
                Copy Link
                <Copy className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div>
              <p className="font-semibold">Your username:</p>
              <p className="text-sm">{user.username}</p>
            </div>
            <div>
              <p className="font-semibold">Your password:</p>
              <p className="break-all text-sm bg-secondary p-2 rounded">{user.password}</p>
              <Button onClick={copyPasswordToClipboard} variant="outline" className="mt-2">
                Copy Password
                <Key className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <MessageCircle className="h-6 w-6 mr-2 text-primary" />
              Your Messages
            </CardTitle>
            <CardDescription>Anonymous messages you've received</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {messages.length > 0 ? (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {messages.map((message, index) => (
                    <motion.li
                      key={message._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-secondary p-4 rounded-lg"
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Received on: {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <p>No messages yet. Share your link to start receiving anonymous messages!</p>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
      <ToastContainer position="bottom-center" />
    </div>
  )
}