import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { MessageCircle, PenSquare, User } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Quronymous</span>
        </Link>
        <div className="flex items-center space-x-4">
          {/* <Link href="/send">
            <Button variant="ghost" size="sm">
              <PenSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </Link> */}
          <Link href="/messages">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              My Messages
            </Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}