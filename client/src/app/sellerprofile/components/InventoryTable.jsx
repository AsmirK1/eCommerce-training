'use client';

import React, { useState, useEffect } from 'react';

export default function InventoryTable({ products, onUpdateQuantity, onAddProduct }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProductsPopup, setShowProductsPopup] = useState(false);
  const [apiProducts, setApiProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    category: '',
    image: ''
  });

  // Fetch categories from Platzi API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://api.escuelajs.co/api/v1/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products by category
  const fetchProductsByCategory = async (categoryId) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.escuelajs.co/api/v1/categories/${categoryId}/products`);
      const data = await response.json();
      setApiProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setApiProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    if (categoryId) {
      fetchProductsByCategory(categoryId);
    } else {
      setApiProducts([]);
    }
  };

  const handleAddFromApi = (apiProduct) => {
    const productToAdd = {
      name: apiProduct.title,
      price: apiProduct.price.toString(),
      quantity: '10',
      description: apiProduct.description,
      category: categories.find(cat => cat.id === apiProduct.category.id)?.name || 'Uncategorized',
      image: apiProduct.images[0] || ''
    };
    
    setNewProduct(productToAdd);
    setShowProductsPopup(false);
    setShowAddForm(true);
  };

  const handleQuantityUpdate = async (productId) => {
    if (newQuantity && !isNaN(Number(newQuantity))) {
      await onUpdateQuantity(productId, parseInt(newQuantity));
      setEditingProduct(null);
      setNewQuantity('');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price && newProduct.quantity) {
      await onAddProduct(newProduct);
      setNewProduct({
        name: '',
        price: '',
        quantity: '',
        description: '',
        category: '',
        image: ''
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="p-6 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Product Inventory</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowProductsPopup(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Browse Products
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            {showAddForm ? 'Cancel' : 'Add Custom Product'}
          </button>
        </div>
      </div>

      {/* Browse Products Popup */}
      {showProductsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Browse Products from API</h3>
                <button
                  onClick={() => setShowProductsPopup(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading products...</p>
                </div>
              ) : apiProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {apiProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                          {product.images && product.images[0] ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product.title}
                          </h4>
                          <p className="text-sm text-gray-700">${product.price}</p>
                          <p className="text-xs text-gray-600 truncate">
                            {product.description}
                          </p>
                          <button
                            onClick={() => handleAddFromApi(product)}
                            className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                          >
                            Add to Inventory
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedCategory ? (
                <div className="text-center py-8 text-gray-600">
                  No products found in this category
                </div>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  Please select a category to browse products
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {newProduct.name ? 'Edit Product Details' : 'Add New Product'}
          </h3>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-800"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                {newProduct.name ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewProduct({
                    name: '',
                    price: '',
                    quantity: '',
                    description: '',
                    category: '',
                    image: ''
                  });
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Current Inventory */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-700 mb-4">Add your first product to get started</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowProductsPopup(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Browse Products
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Add Custom Product
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Sales
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-8 w-8 object-cover rounded" />
                        ) : (
                          <span className="text-gray-500 text-xs">📦</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-700">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingProduct === product.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={newQuantity}
                          onChange={(e) => setNewQuantity(e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-gray-800"
                          min="0"
                        />
                        <button
                          onClick={() => handleQuantityUpdate(product.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingProduct(null)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">{product.quantity}</span>
                        <button
                          onClick={() => {
                            setEditingProduct(product.id);
                            setNewQuantity(product.quantity.toString());
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.sales || 0} sold</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}