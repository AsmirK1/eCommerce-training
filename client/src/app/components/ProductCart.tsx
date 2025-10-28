"use client";
import Link from "next/link";
import { useState } from "react";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  image?: string;
  sellerId?: number;
  quantity: number;
};

export default function ProductCard({ id, name, price, image, sellerId, quantity }: ProductCardProps) {
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
    if (quantity === 0) {
      showNotification('Product is out of stock!');
      return;
    }

    setIsAddingToCart(true);
    
    try {
      console.log(`Adding product ${id} to cart...`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cartItems.find((item: any) => item.id === id);
      
      if (existingItem) {
        // Check if we can add more (don't exceed available quantity)
        if (existingItem.quantity >= quantity) {
          showNotification(`Only ${quantity} items available in stock!`);
          setIsAddingToCart(false);
          return;
        }
        existingItem.quantity += 1;
      } else {
        cartItems.push({
          id,
          name,
          price,
          image,
          quantity: 1,
          sellerId: sellerId || 0
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
      showNotification(`${name} added to cart!`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Failed to add product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="flex flex-col justify-between bg-gradient-to-b from-[#111111] to-[#1a1a1a] border border-[#333] shadow-xl hover:shadow-[0_0_25px_#ff00ff66] transition-all duration-300 transform hover:-translate-y-2 rounded-2xl overflow-hidden w-full max-w-xs h-[400px]">
      {/* Popup Notification */}
      {showPopup && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center">
            <span className="mr-2">✓</span>
            {popupMessage}
          </div>
        </div>
      )}

      {/* image */}
      <figure className="w-full h-[180px] bg-[#111] overflow-hidden flex items-center justify-center">
        <img
          src={image || '/placeholder-image.jpg'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </figure>

      {/* content */}
      <div className="flex flex-col justify-between flex-grow px-4 py-3 text-center">
        <div>
          <h2
            className="text-sm md:text-base font-semibold text-white truncate max-w-[200px] mx-auto"
            title={name}
          >
            {name}
          </h2>
          <p className="text-[#ffb6c1] text-sm mb-1">${price}</p>
          <p className="text-xs text-gray-400 mb-2">
            {quantity > 0 ? `${quantity} in stock` : 'Out of stock'}
          </p>
        </div>

        {/* Buttons Container */}
        <div className="flex flex-col gap-2 mt-auto">
          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={isAddingToCart || quantity === 0}
            className={`w-full py-2 rounded-full font-medium text-sm transition-all duration-300 ${
              isAddingToCart 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : quantity === 0
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 text-white hover:brightness-110 shadow-[0_0_12px_#00ff8080]'
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
            ) : quantity === 0 ? (
              'Out of Stock'
            ) : (
              <span className="flex items-center justify-center">
                🛒 Add to Cart
              </span>
            )}
          </button>

          {/* View Details Button */}
          <Link href={`/products/${id}`}>
            <button className="w-full py-2 rounded-full bg-gradient-to-r from-fuchsia-600 via-pink-500 to-purple-600 text-white font-medium text-sm hover:brightness-110 transition-all duration-300 shadow-[0_0_12px_#ff00ff80]">
              View Details ✨
            </button>
          </Link>
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
    </div>
  );
}