'use client'

import Link from 'next/link'

export default function Navbar() {
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
            <Link href="/auth" className="text-gray-700 hover:text-gray-900 font-medium">
              Sign in/up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}