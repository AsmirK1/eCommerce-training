'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sellerService } from '@/lib/sellerService';
import DashboardStats from './components/DashboardStats';
import OrdersTable from './components/OrdersTable';
import InventoryTable from './components/InventoryTable';
import Header from './components/Header';

interface Order {
  orderId: string;
  items: any[];
  subtotal: number;
  shipping: number;
  total: number;
  orderDate: string;
  status: string;
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
  sales?: number;
}

export default function SellerProfile() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('🔍 SellerProfile - User data:', userData);
        console.log('🔍 SellerProfile - Token:', token);

        if (!token || !userData) {
          router.push('/auth');
          return;
        }

        const user = JSON.parse(userData);
        console.log('🔍 SellerProfile - User role:', user.role);
        console.log('🔍 SellerProfile - User object:', user);

        if (user.role !== 'seller') {
          setError('Access denied. Seller account required.');
          return;
        }

        setUser(user);
        await fetchSellerData();
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/auth');
      }
    };

    const fetchSellerData = async () => {
      try {
        console.log('🔄 Fetching seller data...');
        setLoading(true);
        setError(null);
        
        const [ordersData, productsData] = await Promise.all([
          sellerService.getSellerOrders(),
          sellerService.getSellerProducts()
        ]);
        
        console.log('📊 Orders data received:', ordersData);
        console.log('📊 Products data received:', productsData);
        
        // Prilagodite strukturu podataka ako je potrebno
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
        
        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching seller data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await sellerService.updateOrderStatus(orderId, newStatus);
      // Refresh orders after update
      const updatedOrders = await sellerService.getSellerOrders();
      setOrders(Array.isArray(updatedOrders) ? updatedOrders : []);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    try {
      await sellerService.updateProductQuantity(productId, newQuantity);
      // Refresh products after update
      const updatedProducts = await sellerService.getSellerProducts();
      setProducts(Array.isArray(updatedProducts) ? updatedProducts : []);
    } catch (error) {
      console.error('Error updating product quantity:', error);
      alert('Failed to update product quantity');
    }
  };

  const handleAddProduct = async (productData: any) => {
    try {
      await sellerService.addProduct(productData);
      // Refresh products after adding
      const updatedProducts = await sellerService.getSellerProducts();
      setProducts(Array.isArray(updatedProducts) ? updatedProducts : []);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading seller dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pt-20">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Seller'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your products and orders from your seller dashboard.
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="mb-8">
          <DashboardStats 
            data={{
              storeName: user?.name || "My Store",
              totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
              totalOrders: orders.length,
              totalProducts: products.length,
              conversionRate: "12.5",
              recentOrders: orders.slice(0, 5),
              products: products.slice(0, 5)
            }}
          />
        </div>

        {/* Orders and Inventory Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Orders Section */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
              <p className="text-gray-600 text-sm mt-1">
                Manage and update order statuses
              </p>
            </div>
            <OrdersTable 
              orders={orders} 
              onUpdateStatus={handleUpdateOrderStatus}
            />
          </div>

          {/* Inventory Section */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Product Inventory</h2>
              <p className="text-gray-600 text-sm mt-1">
                Manage your product catalog and stock
              </p>
            </div>
            <InventoryTable 
              products={products}
              onUpdateQuantity={handleUpdateQuantity}
              onAddProduct={handleAddProduct}
            />
          </div>
        </div>
      </main>
    </div>
  );
}