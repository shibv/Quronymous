'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Home() {
  const [username, setUsername] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const router = useRouter()

  const generateLink = async () => {
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate link');
      }

      const data = await response.json()
      setGeneratedLink(`${window.location.origin}/send/${data.uniqueId}`)
      toast.success('Link generated successfully!')
    } catch (error) {
      toast.error(error.message);
    }
  }

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
      .then(() => toast.success('Link copied to clipboard!'))
      .catch(() => toast.error('Failed to copy link'));
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Anonymous Message Generator</CardTitle>
          <CardDescription>Create your unique link to receive anonymous messages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button onClick={generateLink} className="w-full">Generate Link</Button>
          {generatedLink && (
            <div className="mt-4">
              <p className="font-semibold">Your unique link:</p>
              <p className="break-all text-sm">{generatedLink}</p>
              <Button onClick={copyLinkToClipboard} className="mt-2 w-full">Copy Link</Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/messages')} variant="outline" className="w-full">View My Messages</Button>
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>
  )
}
