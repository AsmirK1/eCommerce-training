"use client";
import { useEffect, useState } from "react";
import ProductCart from "../components/ProductCart";

type Category = { id: number; name: string };
type Product = {
  id: number;
  name: string;
  price: number;
  image?: string;
  category: string;
  sellerId: number;
  quantity: number;
};

export default function ProductsPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // ⭐ SVI produkti
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]); // ⭐ PRIKAZANI produkti
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch products from our backend
  const fetchProducts = async () => {
  setLoading(true);
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    console.log('🔄 Fetching ALL products from backend...');
    
    const res = await fetch(`${backendUrl}/api/products`); // ⚠️ Ovo je originalni endpoint
    const data = await res.json();

    console.log('📦 ALL products response:', data);

    if (data.success && data.products) {
      const availableProducts = data.products.filter((p: Product) => p.quantity > 0);
      console.log('✅ Available ALL products:', availableProducts.length);
      
      setAllProducts(availableProducts);
      setDisplayedProducts(availableProducts);
      
      const uniqueCategories = [...new Set(availableProducts.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } else {
        console.warn('❌ No products in response');
        setAllProducts([]);
        setDisplayedProducts([]);
        setCategories([]);
      }
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setAllProducts([]);
      setDisplayedProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Filter products when category changes
  useEffect(() => {
    if (selectedCategory) {
      console.log(`🎯 Filtering by category: ${selectedCategory}`);
      const filtered = allProducts.filter((p: Product) => p.category === selectedCategory);
      console.log(`📊 Filtered products:`, filtered);
      setDisplayedProducts(filtered);
    } else {
      console.log('🎯 Showing all products');
      setDisplayedProducts(allProducts);
    }
  }, [selectedCategory, allProducts]);

  // 🟢 Initial data fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // Get unique categories from products (for buttons)
  const productCategories = [...new Set(allProducts.map(p => p.category))].filter(Boolean);

  console.log('📊 Current state:', {
    allProductsCount: allProducts.length,
    displayedProductsCount: displayedProducts.length,
    selectedCategory,
    categories: productCategories
  });

  return (
    <section className="p-10 text-center max-w-7xl mx-auto bg-gradient-to-b from-[#0a0a0a] to-[#121212] text-white min-h-screen">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-10 drop-shadow-lg">
        ✨ Products ✨
      </h1>

      {/* Debug info - remove in production */}
      <div className="text-xs text-gray-500 mb-4">
        Showing {displayedProducts.length} of {allProducts.length} products
        {selectedCategory && ` in category: ${selectedCategory}`}
      </div>

      {/* Category bar */}
      {productCategories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
              selectedCategory === null
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent"
                : "border-zinc-700 text-gray-300 hover:border-purple-500"
            } transition`}
          >
            All ({allProducts.length})
          </button>
          {productCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent"
                  : "border-zinc-700 text-gray-300 hover:border-purple-500"
              } transition`}
            >
              {category} ({allProducts.filter(p => p.category === category).length})
            </button>
          ))}
        </div>
      )}

      {/* Product grid */}
      {loading ? (
        <p className="text-gray-400 animate-pulse">Loading products...</p>
      ) : (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <ProductCart
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                sellerId={product.sellerId}
                quantity={product.quantity}
              />
            ))
          ) : (
            <p className="col-span-full text-gray-500">
              {selectedCategory 
                ? `No products found in "${selectedCategory}" category ✨` 
                : "No products available ✨"
              }
            </p>
          )}
        </div>
      )}
    </section>
  );
}