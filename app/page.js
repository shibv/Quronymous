'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Copy, LogOut, Key, Eye, EyeOff } from 'lucide-react';

function MainContent() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showPasswordNotice, setShowPasswordNotice] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPassword = searchParams.get('password');

  useEffect(() => {
    if (initialPassword) {
      setShowPasswordNotice(true);
    }
  }, [initialPassword]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        router.push('/main');
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const messageData = await response.json();
        setMessages(messageData);
      } catch (error) {}
    };

    fetchUserData();
    fetchMessages();
  }, [router]);

  const refreshMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const messageData = await response.json();
      setMessages(messageData);
      toast.success('Messages refreshed!');
    } catch (error) {
      toast.error('Failed to refresh messages');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Failed to copy'));
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handlePasswordCopy = () => {
    copyToClipboard(initialPassword);
    setShowPasswordNotice(false);
    // Remove the password from the URL after copying
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('password');
    router.replace(currentUrl.pathname);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {showPasswordNotice && (
          <Card className="shadow-lg mb-8 bg-yellow-200 dark:bg-yellow-800 border border-yellow-400 dark:border-yellow-600">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Important: Save Your Login Information (Take a screenshot)
              </CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300">
                This is your only chance to copy your login information. Save it securely!
                We recommend you take a screenshot and store it somewhere safe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">Username:</p>
                <p className="text-sm bg-secondary p-2 rounded text-gray-800 dark:text-gray-200 dark:bg-gray-700">{user.username}</p>
                <Button onClick={() => copyToClipboard(user.username)} variant="outline" className="mt-2">
                  Copy Username
                  <Copy className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center mt-4">
                <p className="font-semibold text-gray-800 dark:text-gray-200">Password:</p>
                <p className="text-sm bg-secondary p-2 rounded flex-1 text-gray-800 dark:text-gray-200 dark:bg-gray-700">
                  {isPasswordVisible ? initialPassword : '••••••••••'}
                </p>
                <Button variant="ghost" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="ml-2">
                  {isPasswordVisible ? <EyeOff className="h-5 w-5 text-gray-800 dark:text-gray-200" /> : <Eye className="h-5 w-5 text-gray-800 dark:text-gray-200" />}
                </Button>
              </div>
              <Button onClick={handlePasswordCopy} variant="outline" className="mt-2">
                Copy Password
                <Copy className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

<Card className="shadow-lg mb-8" style={{ background: "linear-gradient(90deg, #fff7ad, #ffa9f9)" }} >
  <CardHeader>
    <CardTitle className="text-2xl font-bold flex items-center justify-between">
      <span>Welcome, {user.name}</span>
      <Button variant="outline" onClick={handleLogout}>
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
      <Button onClick={() => copyToClipboard(user.uniqueLink)} variant="outline" className="mt-2">
        Copy Link
        <Copy className="ml-2 h-4 w-4" />
      </Button>
    </div>
  </CardContent>
</Card>


        <Card className="shadow-lg" style={{ background: "linear-gradient(90deg, #fff7ad, #ffa9f9)" }}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span className='flex items-center'>
                <MessageCircle className="h-6 w-6 mr-2 text-primary" />
                Your Messages
              </span>
              <Button variant="outline" onClick={refreshMessages}>
                Refresh Messages
              </Button>
            </CardTitle>
            <CardDescription>Anonymous messages you&apos;ve received</CardDescription>
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
      <ToastContainer position="top-center" />
    </div>
  );
}

export default function Main() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainContent />
    </Suspense>
  );
}
