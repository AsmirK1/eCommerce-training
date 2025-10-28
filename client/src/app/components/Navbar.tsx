'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Provjeri da li je korisnik ulogovan
    const checkAuth = () => {
      const userData = localStorage.getItem('user')
      const token = localStorage.getItem('authToken')
      
      if (userData && token) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Error parsing user data:', error)
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
        }
      }
    }

    checkAuth()

    // Dodaj event listener za promjene u localStorage
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Provjeravaj svakih 500ms za promjene (fallback)
    const interval = setInterval(checkAuth, 500)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    router.push('/auth')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Website name */}
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-xl font-bold text-gray-900 cursor-pointer">Ecommerce-Training</h1>
            </Link>
          </div>

          {/* Right side - Navigation links */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
              Homepage
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-gray-900 font-medium">
              Products
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-gray-900 font-medium">
              Cart
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                

                {/* Dashboard link based on role */}
                {user?.role === 'seller' && (
                  <Link 
                    href="/sellerprofile" 
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Seller Dashboard
                  </Link>
                )}
                {user?.role === 'user' && (
                  <Link 
                    href="/userProfile" 
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    My Profile
                  </Link>
                )}

                {/* Sign Out button */}
                <button
                  onClick={handleSignOut}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/auth" className="text-gray-700 hover:text-gray-900 font-medium">
                Sign in/up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}