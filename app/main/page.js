'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion } from 'framer-motion'
import { Sparkles, Copy, ArrowRight, MessageCircle, UserPlus, LogIn } from 'lucide-react'

export default function Home() {
  const [username, setUsername] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const router = useRouter()

  const generateLink = async () => {
    // Here, you might check if a user is logged in; this is just an example condition.
    const userLoggedIn = false; // Replace with actual auth check

    if (!userLoggedIn) {
      toast.info('Please register or login to create a link.')
      return
    }

    if (!username.trim()) {
      toast.error('Please enter a username')
      return
    }

    try {
      const response = await fetch('/api/generate-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate link')
      }

      const data = await response.json()
      setGeneratedLink(`${window.location.origin}/send/${data.uniqueId}`)
      toast.success('Link generated successfully!')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link'))
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to Quronymous</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Ask questions and send anonymous messages to your favorite people, inspired by Anonymous Message.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Generate Your Link</CardTitle>
            <CardDescription>Create a unique link to receive anonymous messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            /> */}
            <Link href="/register">
            <Button  className="w-full group">
            Register or Login
              <Sparkles className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            </Button>
            </Link>
           
            {generatedLink && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-2"
              >
                <p className="font-semibold">Your unique link:</p>
                <p className="break-all text-sm bg-secondary p-2 rounded">{generatedLink}</p>
                <Button onClick={copyLinkToClipboard} variant="outline" className="w-full mt-2">
                  Copy Link
                  <Copy className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">How It Works</CardTitle>
            <CardDescription>Learn about Quronymous features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <MessageCircle className="h-6 w-6 mt-1 text-primary" />
              <p>Generate a unique link to receive anonymous messages</p>
            </div>
            <div className="flex items-start space-x-3">
              <MessageCircle className="h-6 w-6 mt-1 text-primary" />
              <p>Share your link with friends or on your Social profile</p>
            </div>
            <div className="flex items-start space-x-3">
              <MessageCircle className="h-6 w-6 mt-1 text-primary" />
              <p>Receive anonymous questions and messages</p>
            </div>
            <div className="flex items-start space-x-3">
              <MessageCircle className="h-6 w-6 mt-1 text-primary" />
              <p>Answer questions publicly or privately</p>
            </div>
          </CardContent>
          {/* <CardFooter>
            <Button onClick={() => router.push('/messages')} variant="outline" className="w-full">
              View My Messages
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter> */}
        </Card>
      </div>
      <ToastContainer position="top-center" />
    </div>
  )
}
