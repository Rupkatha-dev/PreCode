"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithGoogle, signInWithGithub, auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState<{ id: number; text: string; sender: 'ai' | 'user' }[]>([])
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
      { id: 1, text: "I need a landing page with a light orange theme.", sender: 'user' as const, delay: 1000 },
      { id: 2, text: "Analyzing requirements...", sender: 'ai' as const, delay: 2000 },
      { id: 3, text: "Generating premium SaaS design layout...", sender: 'ai' as const, delay: 3500 },
      { id: 4, text: "Ready to deploy! ✨", sender: 'ai' as const, delay: 5000 },
    ]

    sequence.forEach(({ delay, ...msg }) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, msg])
      }, delay)
    })

    return () => unsubscribe()
  }, [router])

  const handleLogin = async () => {
    try {
      await signInWithGoogle()
      router.push('/dashboard')
    } catch (error) {
      console.error("Login failed", error)
    }
  }

  const handleGithubLogin = async () => {
    try {
      await signInWithGithub()
      router.push('/dashboard')
    } catch (error) {
      console.error("GitHub Login failed", error)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden font-sans">
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
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={handleLogin} className="text-sm font-semibold bg-gray-900 text-white px-4 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-md hover:shadow-xl flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button onClick={handleGithubLogin} className="text-sm font-semibold bg-[#24292e] text-white px-4 py-2.5 rounded-full hover:bg-black transition-all shadow-md hover:shadow-xl flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>
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
            <button onClick={handleLogin} className="w-full sm:w-auto text-center font-semibold bg-gradient-to-r from-orange-500 to-rose-500 text-white px-8 py-4 rounded-full hover:shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1">
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
                    className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user' 
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
