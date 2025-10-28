'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createOrder, type OrderItem } from '@/lib/orderService'

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sellerId?: number; 
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [showThankYouPopup, setShowThankYouPopup] = useState(false)

  useEffect(() => {
    const loadCartItems = () => {
      try {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          setCartItems(JSON.parse(savedCart))
        }
      } catch (error) {
        console.error('Error loading cart:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCartItems()
    window.addEventListener('storage', loadCartItems)
    
    return () => window.removeEventListener('storage', loadCartItems)
  }, [])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
      return
    }

    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const handleBuy = async () => {
    if (cartItems.length === 0) return;

    setCheckoutLoading(true);
    try {
      
      const orderItemsWithSeller = cartItems.map(item => ({
        ...item,
        sellerId: item.sellerId || 1 
      }));

      console.log('🛒 Order items with seller:', orderItemsWithSeller);

      const orderData = {
        items: orderItemsWithSeller, 
        subtotal,
        shipping,
        total,
        orderDate: new Date().toISOString(),
        status: 'pending' as const
      };

      const result = await createOrder(orderData);
      
      if (result.success) {
        // Clear cart on successful order creation
        localStorage.removeItem('cart');
        setCartItems([]);
        
        // Show thank you popup instead of alert
        setShowThankYouPopup(true);
      } else {
        alert(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error during checkout. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  }

  const continueShopping = () => {
    setShowThankYouPopup(false);
  }

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = cartItems.length > 0 ? 5.99 : 0
  const total = subtotal + shipping

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Thank You Popup */}
      {showThankYouPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You for Your Purchase!</h2>
              <p className="text-gray-600 mb-6">
                Your order has been successfully placed. We appreciate your business!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={continueShopping}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Continue Shopping
                </button>
                <Link 
                  href="/"
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-md font-medium transition-colors text-center"
                >
                  Go to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Link href="/products" className="text-blue-600 hover:text-blue-700 font-medium">
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some amazing products to your cart!</p>
            <Link 
              href="/products"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Cart Items */}
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="p-6 flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Image</span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    {item.sellerId && (
                      <p className="text-xs text-gray-500">Seller ID: {item.sellerId}</p>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-600">-</span>
                    </button>
                    <span className="w-8 text-center font-medium text-gray-700">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-600">+</span>
                    </button>
                  </div>

                  {/* Total Price */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 text-sm mt-1 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">${shipping.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleBuy}
                disabled={checkoutLoading}
                className={`w-full ${
                  checkoutLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                } text-white py-3 px-4 rounded-md font-medium mt-6 transition-colors disabled:opacity-50`}
              >
                {checkoutLoading ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          </div>
        )}

        {/* Cart Stats */}
        {cartItems.length > 0 && (
          <div className="mt-6 text-center text-gray-600 text-sm">
            <p>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart • Total: ${total.toFixed(2)}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}