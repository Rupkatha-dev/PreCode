"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithGoogle, signInWithGithub, auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import LoginModal from "@/components/LoginModal"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState<{ id: number; text: string; sender: 'ai' | 'user' }[]>([])
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)

    // Check auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard')
      }
    })

    // Simulate dynamic chat messages
    const sequence = [
      { id: 1, text: "I'll reverse the string in a loop and compare it to check for a palindrome.", sender: 'user' as const, delay: 1000 },
      { id: 2, text: "Good start. What about spaces and capitalization?", sender: 'ai' as const, delay: 2000 },
      { id: 3, text: "Right, I should convert to lowercase and strip spaces first.", sender: 'user' as const, delay: 3500 },
      { id: 4, text: "Excellent edge case handling! You may now begin coding.", sender: 'ai' as const, delay: 5000 },
    ]

    sequence.forEach(({ delay, ...msg }) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, msg])
      }, delay)
    })

    return () => unsubscribe()
  }, [router])

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden font-sans">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Light Orange Gradients / Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] bg-orange-100 rounded-full blur-[100px] opacity-70 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] bg-orange-200 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-[#fff3e0] rounded-full blur-[90px] opacity-80 pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
            P
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">PreCode</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Dashboard
          </Link>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="text-sm font-semibold bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-md hover:shadow-xl flex items-center gap-2"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">

        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Introducing PreCode 2.0
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900">
            Think <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">before</span> you type.
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            An AI-powered educational platform that enforces a structured workflow. Plan your logic, specify behavior, and write better code.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full sm:w-auto text-center font-semibold bg-gradient-to-r from-orange-500 to-rose-500 text-white px-8 py-4 rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1"
            >
              Start Free Trial
            </button>
            <button className="w-full sm:w-auto text-center font-semibold bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Dynamic Unsearchable Chatbox */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative animate-fade-up delay-2">
          {/* Chat UI Container */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden shadow-orange-900/5">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100/50 bg-white/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-sm font-semibold text-gray-700">PreCode AI</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-6 h-[320px] overflow-y-auto flex flex-col gap-4">
              {mounted && messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                        ? 'bg-gradient-to-br from-orange-500 to-rose-500 text-white rounded-tr-none'
                        : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {mounted && messages.length < 4 && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white border border-gray-100 px-5 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Unsearchable Input Footer */}
            <div className="p-4 bg-gray-50/50 border-t border-gray-100/50">
              <div className="relative group">
                <input
                  type="text"
                  readOnly
                  disabled
                  placeholder="Ask PreCode to generate a component..."
                  className="w-full bg-white border border-gray-200 text-gray-500 text-sm rounded-full pl-5 pr-12 py-3.5 focus:outline-none cursor-not-allowed shadow-sm group-hover:border-orange-200 transition-colors"
                />
                <button
                  disabled
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center cursor-not-allowed opacity-50"
                >
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Decorative Elements around chatbox */}
          <div className="absolute -z-10 -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
          <div className="absolute -z-10 -bottom-8 -left-8 w-32 h-32 bg-orange-300 rounded-full blur-3xl opacity-50"></div>
        </div>

      </main>
    </div>
  )
}
