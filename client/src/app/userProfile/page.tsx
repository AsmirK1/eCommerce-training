'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getUserOrders } from '@/lib/orderService' // IMPORT NOVOG SERVISA

interface User {
  id: number;
  email: string;
  role: 'user' | 'seller';
  createdAt: string;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  addedDate: string;
}

export default function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'settings'>('orders')
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const router = useRouter()

  // Funkcija za učitavanje narudžbi sa backenda
  const loadOrdersFromBackend = async () => {
    setOrdersLoading(true)
    try {
      const result = await getUserOrders()
      if (result.success && result.orders) {
        console.log('✅ Orders loaded from backend:', result.orders)
        setOrders(result.orders)
        
        // Sačuvaj u localStorage za offline prikaz
        if (user?.id) {
          localStorage.setItem(`orders_${user.id}`, JSON.stringify(result.orders))
        }
      } else {
        console.error('❌ Failed to load orders:', result.message)
        // Fallback na localStorage ako backend ne radi
        loadOrdersFromLocalStorage()
      }
    } catch (error) {
      console.error('❌ Error loading orders:', error)
      // Fallback na localStorage
      loadOrdersFromLocalStorage()
    } finally {
      setOrdersLoading(false)
    }
  }

  // Fallback funkcija za učitavanje iz localStorage
  const loadOrdersFromLocalStorage = () => {
    try {
      const savedOrders = localStorage.getItem(`orders_${user?.id}`)
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders)
        setOrders(parsedOrders)
        console.log('📦 Orders loaded from localStorage:', parsedOrders)
      }
    } catch (error) {
      console.error('Error loading orders from localStorage:', error)
    }
  }

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken')
      const userData = localStorage.getItem('user')
      
      if (!token || !userData) {
        router.push('/auth')
        return
      }

      try {
        const parsedUser = JSON.parse(userData)
        if (parsedUser.role !== 'user') {
          router.push('/sellerprofile')
          return
        }
        setUser(parsedUser)
        loadUserData(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
        router.push('/auth')
      }
    }

    const loadUserData = (userData: User) => {
      // Prvo pokušaj učitati sa backenda
      loadOrdersFromBackend()
      
      // Učitaj wishlist iz localStorage
      try {
        const savedWishlist = localStorage.getItem(`wishlist_${userData.id}`)
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist))
        }
      } catch (error) {
        console.error('Error loading wishlist:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    router.push('/auth')
  }

  const removeFromWishlist = (itemId: number) => {
    const updatedWishlist = wishlist.filter(item => item.id !== itemId)
    setWishlist(updatedWishlist)
    localStorage.setItem(`wishlist_${user?.id}`, JSON.stringify(updatedWishlist))
  }

  const moveToCart = (wishlistItem: WishlistItem) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = currentCart.find((item: any) => item.id === wishlistItem.id)
    
    let updatedCart
    if (existingItem) {
      updatedCart = currentCart.map((item: any) =>
        item.id === wishlistItem.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      updatedCart = [...currentCart, { ...wishlistItem, quantity: 1 }]
    }
    
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    removeFromWishlist(wishlistItem.id)
    alert('Item moved to cart!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatOrderDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-semibold text-gray-600">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Link 
                href="/products"
                className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Continue Shopping
              </Link>
              <button
                onClick={handleLogout}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Orders
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'wishlist'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Wishlist
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Account Settings
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
                  <button
                    onClick={loadOrdersFromBackend}
                    disabled={ordersLoading}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                  >
                    {ordersLoading ? 'Refreshing...' : 'Refresh Orders'}
                  </button>
                </div>
                
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                    <Link 
                      href="/products"
                      className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-medium transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.orderId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-900">Order #{order.orderId}</p>
                            <p className="text-sm text-gray-500">
                              {formatOrderDate(order.orderDate || order.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <p className="text-lg font-semibold text-gray-900">
                              ${order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-3">
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                            <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span>Subtotal: ${order.subtotal.toFixed(2)}</span>
                            <span>•</span>
                            <span>Shipping: ${order.shipping.toFixed(2)}</span>
                          </div>
                          
                          {/* Order Items Preview */}
                          <div className="flex space-x-2 overflow-x-auto pb-2">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 min-w-0 flex-shrink-0">
                                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                                  {item.image ? (
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-gray-400 text-xs">📦</span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
                                <span className="text-sm text-gray-500">+{order.items.length - 3} more</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex space-x-2 mt-3">
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              View Details
                            </button>
                            <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                              Track Order
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Ostali tabovi ostaju isti */}
            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">My Wishlist</h2>
                
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">❤️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-6">Save items you love for later</p>
                    <Link 
                      href="/products"
                      className="inline-block bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-medium transition-colors"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">Image</span>
                            )}
                          </div>
                          
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        
                        <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-lg font-semibold text-gray-900 mb-3">${item.price.toFixed(2)}</p>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => moveToCart(item)}
                            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                
                <div className="max-w-md space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-sm text-gray-500 mt-1">Contact support to change your email</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
                        {user?.role === 'user' ? 'Customer' : 'Seller'}
                      </span>
                      <Link 
                        href="/auth"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Switch to {user?.role === 'user' ? 'Seller' : 'Customer'}
                      </Link>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">{orders.length}</div>
            <div className="text-gray-600">Total Orders</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">{wishlist.length}</div>
            <div className="text-gray-600">Wishlist Items</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {orders.filter(order => order.status === 'delivered').length}
            </div>
            <div className="text-gray-600">Delivered Orders</div>
          </div>
        </div>

      </div>
    </div>
  )
}