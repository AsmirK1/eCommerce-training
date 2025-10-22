'use client'

import { useState, useEffect } from 'react'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            {isLogin ? 'Enter your login details' : 'Create a new account'}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400 text-gray-800"
              placeholder="your@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400 text-gray-800"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password (only for sign up) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400 text-gray-800"
                placeholder="••••••••"
              />
            </div>
          )}

          {/* Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-md font-medium"
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* Switch button */}
        <div className="mt-6 text-center border-t border-gray-200 pt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>

      </div>
    </div>
  )
}