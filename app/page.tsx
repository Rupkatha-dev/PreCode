"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import LoginModal from "@/components/LoginModal"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [messages, setMessages] = useState<{ id: number; text: string; sender: 'ai' | 'user' }[]>([])
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard')
      }
    })

    const sequence = [
      { id: 1, text: "I'll reverse the string in a loop and compare it to check for a palindrome.", sender: 'user' as const, delay: 1000 },
      { id: 2, text: "Good start. What about spaces and capitalization?", sender: 'ai' as const, delay: 2500 },
      { id: 3, text: "Right, I should normalize the input before comparing.", sender: 'user' as const, delay: 4500 },
      { id: 4, text: "Excellent edge case handling! You may now begin coding.", sender: 'ai' as const, delay: 6500 },
    ]

    sequence.forEach(({ delay, ...msg }) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, msg])
      }, delay)
    })

    return () => unsubscribe()
  }, [router])

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 relative overflow-hidden">
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* ── Navigation ─────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-stone-200/50 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:shadow-md transition-shadow">
              P
            </div>
            <span className="text-lg font-bold tracking-tight text-stone-900">PreCode</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
              Dashboard
            </Link>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-sm font-semibold bg-stone-900 text-white px-5 py-2 rounded-full hover:bg-stone-800 transition-all hover:scale-105 active:scale-95"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="max-w-xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-[11px] font-bold uppercase tracking-widest mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Introducing PreCode 2.0
            </div>
            <h1 className="font-serif text-6xl lg:text-7xl text-stone-900 leading-[1.05] mb-8">
              Think deeply. <br />
              <span className="italic text-stone-400">Code confidently.</span>
            </h1>
            <p className="text-lg text-stone-500 leading-relaxed mb-10 max-w-md">
              An AI-powered platform that forces you to plan before you type. Build better programming habits through structured thinking.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-stone-900 text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-stone-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-stone-900/10"
              >
                Start Learning
              </button>
              <Link href="/dashboard" className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
                View Dashboard →
              </Link>
            </div>
          </div>

          {/* Visual: Dynamic Product Window */}
          <div className="relative animate-fade-up delay-2">
            <div className="relative bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] border border-stone-200/80 overflow-hidden">
              {/* Window Chrome */}
              <div className="bg-stone-50 px-5 py-3.5 flex items-center gap-3 border-b border-stone-100">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-stone-300" />
                  <div className="w-3 h-3 rounded-full bg-stone-300" />
                  <div className="w-3 h-3 rounded-full bg-stone-300" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[11px] text-stone-500 font-mono tracking-wide">AI TUTOR — SESSION #402</span>
                </div>
              </div>

              {/* Dynamic Chat Content */}
              <div className="p-6 h-[340px] overflow-hidden flex flex-col gap-4 bg-white">
                {mounted && messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div className={`max-w-[85%] flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${msg.sender === 'user' ? 'bg-stone-900 text-white' : 'bg-orange-100 text-orange-700'}`}>
                        {msg.sender === 'user' ? 'You' : 'AI'}
                      </div>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-stone-900 text-white rounded-tr-none' : 'bg-stone-50 border border-stone-100 text-stone-700 rounded-tl-none'}`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
                {mounted && messages.length < 4 && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-stone-50 border border-stone-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 w-fit">
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Stub */}
              <div className="px-5 py-4 bg-stone-50/50 border-t border-stone-100">
                <div className="bg-white border border-stone-200 rounded-full px-4 py-2.5 text-sm text-stone-400 flex items-center justify-between shadow-sm">
                  <span>Ask PreCode a question...</span>
                  <div className="w-6 h-6 bg-stone-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Orbs */}
            <div className="absolute -z-10 top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute -z-10 bottom-0 left-0 w-64 h-64 bg-stone-200 rounded-full blur-3xl opacity-60 -translate-x-1/3 translate-y-1/3" />
          </div>
        </div>
      </section>

      {/* ── Philosophy Section ─────────────────────────────── */}
      <section className="bg-stone-950 text-stone-50 py-28 lg:py-40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="font-serif text-4xl lg:text-6xl mb-10 leading-[1.15]">
            “Programming is 80% thinking <br className="hidden lg:block" /> and 20% typing.”
          </h2>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto leading-relaxed mb-12">
            Most coding tools help you type faster. PreCode helps you think better. By enforcing a “Think-First” approach, we prevent the costly pitfall of “guess-and-check” coding.
          </p>
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-stone-900 border border-stone-800 text-stone-300 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            Built for serious learners
          </div>
        </div>
        <div className="absolute -z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-3xl" />
      </section>

      {/* ── Workflow Section ───────────────────────────────── */}
      <section className="py-28 bg-white relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-orange-600 text-xs font-bold uppercase tracking-widest mb-4 block">How it works</span>
            <h2 className="font-serif text-4xl lg:text-5xl text-stone-900 mb-4">The Think-First Workflow</h2>
            <p className="text-stone-500 max-w-lg mx-auto">A structured path from ambiguity to implementation.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-stone-100" />

            {[
              {
                num: "01",
                title: "Specification",
                desc: "Define behavior, inputs, outputs, and edge cases. The AI tutor provides feedback and asks clarifying questions without giving away solutions."
              },
              {
                num: "02",
                title: "Implementation",
                desc: "Write your solution in an integrated Monaco Editor. Real-time AI assistance helps with syntax, but the tutor stays strict about logic."
              },
              {
                num: "03",
                title: "Reflection",
                desc: "Compare your code against your original specification. Identify mismatches and reflect on your learning process to build lasting habits."
              },
            ].map((step, i) => (
              <div
                key={step.num}
                className="group relative p-8 rounded-3xl border border-stone-100 bg-stone-50/30 hover:bg-white hover:border-orange-200/60 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-8 relative">
                  <span className="font-serif text-5xl text-stone-200 group-hover:text-orange-200 transition-colors duration-500">{step.num}</span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors duration-500 ${i === 0 ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-stone-200 text-stone-400 group-hover:border-orange-200 group-hover:text-orange-600'}`}>
                    {i === 0 ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    ) : i === 1 ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-stone-900 mb-3">{step.title}</h3>
                <p className="text-stone-500 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo / Feature Highlight ───────────────────────── */}
      <section className="py-28 bg-stone-50 border-t border-stone-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-orange-600 text-xs font-bold uppercase tracking-widest mb-4 block">AI Tutor</span>
              <h2 className="font-serif text-4xl lg:text-5xl text-stone-900 mb-6 leading-tight">
                A facilitator, <br /><span className="italic text-stone-400">not a solver.</span>
              </h2>
              <p className="text-stone-500 leading-relaxed mb-8 text-lg">
                Our AI is specifically tuned to guide you toward the answer without handing it to you. It enforces the cognitive heavy lifting, ensuring the learning stays with you.
              </p>
              <ul className="space-y-4">
                {[
                  "Socratic questioning for deeper understanding",
                  "Strict spec-to-code comparison",
                  "Real-time syntax assistance without spoilers"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-stone-700">
                    <svg className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="bg-stone-900 rounded-3xl p-8 shadow-2xl shadow-stone-900/20 overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-stone-700" />
                  <div className="w-3 h-3 rounded-full bg-stone-700" />
                  <div className="w-3 h-3 rounded-full bg-stone-700" />
                </div>
                <div className="font-mono text-sm leading-relaxed space-y-4 text-stone-300">
                  <div className="flex gap-3">
                    <span className="text-stone-600 select-none">1</span>
                    <span><span className="text-purple-400">def</span> <span className="text-blue-400">is_palindrome</span>(s: <span className="text-yellow-400">str</span>) -&gt; <span className="text-yellow-400">bool</span>:</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-stone-600 select-none">2</span>
                    <span>    <span className="text-stone-500"># 1. Normalize: lowercase & strip spaces</span></span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-stone-600 select-none">3</span>
                    <span>    clean = s.lower().replace(<span className="text-green-400">&quot; &quot;</span>, <span className="text-green-400">&quot;&quot;</span>)</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-stone-600 select-none">4</span>
                    <span>    <span className="text-stone-500"># 2. Compare with reverse</span></span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-stone-600 select-none">5</span>
                    <span>    <span className="text-purple-400">return</span> clean == clean[::-1]</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-stone-600 select-none">6</span>
                    <span></span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-stone-600 select-none">7</span>
                    <span><span className="text-stone-500"># Edge cases handled:</span></span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-stone-600 select-none">8</span>
                    <span><span className="text-stone-500"># - Empty strings</span></span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-stone-600 select-none">9</span>
                    <span><span className="text-stone-500"># - Mixed capitalization</span></span>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute bottom-6 right-6 bg-stone-800/90 backdrop-blur border border-stone-700 rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-stone-300 font-medium">Spec matched</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-white border-t border-stone-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-md flex items-center justify-center text-white font-bold text-xs">P</div>
            <span className="text-sm font-semibold text-stone-900">PreCode</span>
          </div>
          <p className="text-sm text-stone-400">
            © {new Date().getFullYear()} PreCode. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Dashboard</Link>
            <button onClick={() => setIsLoginModalOpen(true)} className="text-sm text-stone-500 hover:text-stone-900 transition-colors">Login</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
