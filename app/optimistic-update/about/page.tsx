'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <nav className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            @chemmangat/optimistic-update
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/optimistic-update/demo" className="hover:text-blue-300 transition-colors">
              Demo
            </Link>
            <Link href="/optimistic-update/about" className="hover:text-blue-300 transition-colors">
              About
            </Link>
            <a 
              href="https://chemmangathari.in" 
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105"
            >
              Visit Site
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-20 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Optimistic Update
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Make your React apps feel instant with extraordinary hooks for optimistic UI updates
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 transition-all duration-1000 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
              <p className="text-gray-300">
                Updates happen instantly in the UI while mutations run in the background. Your users never wait.
              </p>
            </div>

            <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Auto Rollback</h3>
              <p className="text-gray-300">
                If a mutation fails, the UI automatically rolls back to the exact previous state. No manual cleanup needed.
              </p>
            </div>

            <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Type Safe</h3>
              <p className="text-gray-300">
                Full TypeScript support with generics. Works with any data shape and catches errors at compile time.
              </p>
            </div>
          </div>

          <div className={`bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-12 border border-white/20 mb-20 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold mb-8 text-center">Quick Start</h2>
            <div className="bg-gray-900/50 rounded-xl p-6 font-mono text-sm overflow-x-auto">
              <div className="text-gray-400 mb-4"># Install the package</div>
              <div className="text-green-400 mb-6">npm install @chemmangat/optimistic-update</div>
              
              <div className="text-gray-400 mb-4"># Use in your React app</div>
              <pre className="text-blue-300">
{`import { useOptimisticList } from '@chemmangat/optimistic-update'

const { items, addItem, removeItem, updateItem } = 
  useOptimisticList(data, {
    idKey: 'id',
    onError: (err) => toast.error(err.message),
  })`}
              </pre>
            </div>
          </div>

          <div className={`text-center transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold mb-8">See It In Action</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Try the interactive demo to see optimistic updates and automatic rollback in real-time
            </p>
            <Link
              href="/optimistic-update/demo"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-2xl"
            >
              Launch Demo →
            </Link>
          </div>

          <div className={`mt-32 grid md:grid-cols-2 gap-12 transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div>
              <h3 className="text-3xl font-bold mb-6">Why Optimistic State?</h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  Traditional UI updates wait for the server to respond before showing changes. This creates lag and makes your app feel slow.
                </p>
                <p>
                  Optimistic updates show changes immediately, making your app feel instant. But handling rollbacks manually is complex and error-prone.
                </p>
                <p>
                  Optimistic State handles all the complexity for you — instant updates, automatic rollback on failure, and proper handling of concurrent mutations.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold mb-6">Features</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  <span>Instant UI updates with automatic rollback</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  <span>Handle multiple simultaneous mutations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  <span>Full TypeScript support with generics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  <span>Zero dependencies (just React)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  <span>Automatic cleanup on unmount</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3">✓</span>
                  <span>Works with any data structure</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 mt-32 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p>Built with ❤️ for the React community</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="https://github.com" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://npmjs.com" className="hover:text-white transition-colors">npm</a>
            <a href="/optimistic-update/demo" className="hover:text-white transition-colors">Demo</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
