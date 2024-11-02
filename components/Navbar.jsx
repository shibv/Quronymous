'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { MessageCircle, UserPlus, LogIn, LogOut } from "lucide-react"
import { toast } from 'react-toastify'
import Image from 'next/image'; 

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/user')
        setIsLoggedIn(response.ok)
      } catch (error) {
        setIsLoggedIn(false)
      }
    }

    checkLoginStatus()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' })
      if (response.ok) {
        setIsLoggedIn(false)
        toast.success('Logged out successfully')
        router.push('/login')
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  return (
    <nav
  className="sticky top-0 z-50 border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  
>
  <div className="container flex h-16 items-center justify-between px-4">
    <Link href="/" className="flex items-center space-x-1">
      <Image src="/logo_bcg.png" alt="Quronymous Logo" width={30} height={30} className="h-10 w-10 text-primary" />
      <span className="font-bold text-xl">Quronymous</span>
    </Link>
    <div className="flex items-center space-x-4">
      {/* Uncomment the following code if you need login/register buttons */}
      {/* 
      {isLoggedIn ? (
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      ) : (
        <>
          <Link href="/register">
            <Button variant="ghost" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Register
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
          </Link>
        </>
      )}
      */}
      {/* Uncomment if you need mode toggle */}
      {/* <ModeToggle /> */}
    </div>
  </div>
</nav>

  )
}