"use client";
import { useEffect, useState } from "react";
import ProductCart from "../components/ProductCart";

type Category = { id: number; name: string };
type Product = {
  id: number;
  title: string;
  price: number;
  images: string[];
  category?: { id: number; name: string };
};

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch categories once
  useEffect(() => {
    fetch("https://api.escuelajs.co/api/v1/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // 🟢 Fetch ALL products once, then filter locally
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch("https://api.escuelajs.co/api/v1/products?offset=0&limit=100");
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Unexpected response format:", data);
          setProducts([]);
          return;
        }

        // filter products by selected category
        const filtered = selectedCategory
          ? data.filter((p) => p.category?.id === selectedCategory)
          : data;

        setProducts(filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory]);

  // 🟣 UI rendering
  return (
    <section className="p-10 text-center max-w-7xl mx-auto bg-gradient-to-b from-[#0a0a0a] to-[#121212] text-white min-h-screen">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-10 drop-shadow-lg">
        ✨ Products ✨
      </h1>

      {/* Category bar */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
            selectedCategory === null
              ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent"
              : "border-zinc-700 text-gray-300 hover:border-purple-500"
          } transition`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
              selectedCategory === cat.id
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent"
                : "border-zinc-700 text-gray-300 hover:border-purple-500"
            } transition`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {loading ? (
        <p className="text-gray-400 animate-pulse">Loading...</p>
      ) : (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCart
                key={product.id}
                id={product.id}
                name={product.title}
                price={product.price}
                image={product.images?.[0]}
              />
            ))
          ) : (
            <p className="col-span-full text-gray-500">No enchanted products found ✨</p>
          )}
        </div>
      )}
    </section>
  );
}