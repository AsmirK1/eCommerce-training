/* shows details for one specific product */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  sellerId?: number;
  quantity: number;
  category: string;
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const showNotification = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (product.quantity === 0) {
      showNotification('Product is out of stock!');
      return;
    }

    setIsAddingToCart(true);
    
    try {
      console.log(`Adding product ${product.id} to cart...`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cartItems.find((item: any) => item.id === product.id);
      
      if (existingItem) {
        // Check if we can add more
        if (existingItem.quantity >= product.quantity) {
          showNotification(`Only ${product.quantity} items available in stock!`);
          setIsAddingToCart(false);
          return;
        }
        existingItem.quantity += 1;
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          sellerId: product.sellerId || 0
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
      showNotification(`${product.name} added to cart!`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Failed to add product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        // First try our backend
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
        const res = await fetch(`${backendUrl}/api/products`);
        const data = await res.json();
        
        if (data.success) {
          const foundProduct = data.products.find((p: Product) => p.id === parseInt(id as string));
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            // If not found in our DB, try external API
            const apiRes = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`);
            const apiData = await apiRes.json();
            
            if (apiData.id) {
              setProduct({
                id: apiData.id + 10000,
                name: apiData.title,
                price: apiData.price,
                description: apiData.description,
                image: apiData.images?.[0],
                sellerId: 0,
                quantity: 10,
                category: apiData.category?.name || 'Uncategorized'
              });
            } else {
              setProduct(null);
            }
          }
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center p-10 text-white">Loading...</p>;
  if (!product) return <p className="text-center p-10 text-white">Product not found.</p>;

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black text-gray-100 px-6 py-12">
      {/* Popup Notification */}
      {showPopup && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center">
            <span className="mr-2">✓</span>
            {popupMessage}
          </div>
        </div>
      )}

      <div className="max-w-3xl w-full bg-gradient-to-b from-zinc-900/80 via-zinc-800/80 to-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-purple-900/30 border border-zinc-700/40">
        <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 drop-shadow-lg">
          {product.name}
        </h1>

        <img
          src={product.image || '/placeholder-image.jpg'}
          alt={product.name}
          className="rounded-2xl w-full h-96 object-cover shadow-md shadow-purple-700/20 hover:shadow-pink-500/30 transition duration-500 hover:scale-105"
        />

        <div className="mt-6 text-center">
          <p className="text-2xl font-bold text-purple-300 mb-2">${product.price}</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            {product.description || "No description available."}
          </p>

          {/* Product info */}
          <div className="flex justify-center gap-6 text-sm text-gray-400 mb-6">
            <span>Category: {product.category}</span>
            <span>In Stock: {product.quantity}</span>
          </div>

          <div className="flex justify-center gap-4">
            <button 
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.quantity === 0}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                isAddingToCart 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : product.quantity === 0
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 text-white hover:brightness-110'
              }`}
            >
              {isAddingToCart ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : product.quantity === 0 ? (
                'Out of Stock'
              ) : (
                '🛒 Add to Cart'
              )}
            </button>

            <Link href="/products">
              <button className="px-6 py-2 rounded-full border border-purple-500 text-purple-300 font-medium hover:bg-purple-500/20 transition">
                ← Back to Products
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}