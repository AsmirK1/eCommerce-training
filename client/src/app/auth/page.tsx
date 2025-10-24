'use client'

import { useState, useEffect } from 'react'
import { registerUser, loginUser, validateEmail, validatePassword } from '@/lib/auth'
import { useRouter } from 'next/navigation'

// Definiši TypeScript tipove
interface User {
  id: number;
  email: string;
  createdAt?: string;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Errors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Provjeri da li je korisnik već ulogovan
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('user')
    
    console.log('🔍 useEffect - token:', token);
    console.log('🔍 useEffect - userData:', userData);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
        console.log('✅ Korisnik je već ulogovan:', parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    }
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Errors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message
      }
    }

    // Confirm password validation (only for sign up)
    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🎯 1. handleSubmit POZVAN!')
    console.log('📝 2. Form data:', formData)
    
    setSuccessMessage('')
    setErrors({})
    
    if (!validateForm()) {
      console.log('❌ 3. Form validation FAILED', errors)
      return
    }

    console.log('✅ 4. Form validation PASSED')
    setIsLoading(true)

    try {
      console.log('🔄 5. Počinjem auth proces...')
      
      let response
      
      if (isLogin) {
        console.log('🔐 6. Login pokušaj...')
        response = await loginUser({
          email: formData.email,
          password: formData.password
        })
      } else {
        console.log('📝 7. Register pokušaj...')
        response = await registerUser({
          email: formData.email,
          password: formData.password
        })
      }

      console.log('✅ 8. Auth uspješan!', response)
      
      // Koristi podatke iz response
      setUser(response.user)
      setIsAuthenticated(true)
      
      if (isLogin) {
        setSuccessMessage('Welcome! You are logged in.')
      } else {
        setSuccessMessage(`You are registered. Welcome ${response.user.email}!`)
      }

    } catch (error) {
      console.log('❌ 9. Auth greška:', error)
      setErrors({ 
        submit: (error as Error).message || 'An error occurred. Please try again.' 
      })
    } finally {
      console.log('🏁 10. Završavam...')
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    console.log('🚪 Logout...')
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    })
    setSuccessMessage('')
    setErrors({})
  }

  // Ako je korisnik autentificiran, prikaži welcome poruku i logout dugme
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-md text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {successMessage.includes('registered') ? 'Registration Successful!' : 'Login Successful!'}
          </h1>
          
          <p className="text-gray-600 mb-2">
            {successMessage}
          </p>
          
          <p className="text-gray-500 text-sm mb-6">
            Email: <span className="font-medium">{user.email}</span>
          </p>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              Go to Dashboard
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            {isLogin ? 'Enter your login details' : 'Create a new account'}
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 placeholder-gray-400 text-gray-800 ${
                errors.email 
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                  : 'border-gray-300 focus:ring-gray-400 focus:border-gray-400'
              }`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 placeholder-gray-400 text-gray-800 ${
                errors.password 
                  ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                  : 'border-gray-300 focus:ring-gray-400 focus:border-gray-400'
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password (only for sign up) */}
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 placeholder-gray-400 text-gray-800 ${
                  errors.confirmPassword 
                    ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                    : 'border-gray-300 focus:ring-gray-400 focus:border-gray-400'
                }`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center border-t border-gray-200 pt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setErrors({})
              setSuccessMessage('')
            }}
            className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>

      </div>
    </div>
  )
}