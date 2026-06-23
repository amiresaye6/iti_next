'use client';

import React, { useState, useDeferredValue, useTransition, useMemo } from 'react';
import ProductCard from './ProductCard';

interface ProductData {
  _id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
}

interface ProductsClientWrapperProps {
  products: ProductData[];
}

const ProductsClientWrapper = ({ products = [] }: ProductsClientWrapperProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearch = useDeferredValue(searchQuery);

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isPending, startTransition] = useTransition();

  const [sortBy, setSortBy] = useState('default');

  // Collect unique categories dynamically
  const categories = useMemo(() => {
    const unique = new Set(products.map(p => p.category));
    return ['all', ...Array.from(unique)];
  }, [products]);

  const handleCategorySelect = (category: string) => {
    startTransition(() => {
      setCategoryFilter(category);
    });
  };

  // Perform client-side filter and sorting based on user states
  const processedProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesSearch =
          product.title.toLowerCase().includes(deferredSearch.toLowerCase()) ||
          product.description.toLowerCase().includes(deferredSearch.toLowerCase());

        const matchesCategory =
          categoryFilter === 'all' ||
          product.category === categoryFilter;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rate-desc') return a.rating - b.rating; // Wait, wait! First project had rate-desc as high to low, so: b.rating - a.rating! Let's check.
        // Yes! Rate-desc is Rating: High to Low (b.rating - a.rating) and rate-asc is Rating: Low to High (a.rating - b.rating). Let's fix that!
        if (sortBy === 'rate-desc') return b.rating - a.rating;
        if (sortBy === 'rate-asc') return a.rating - b.rating;
        return 0;
      });
  }, [products, deferredSearch, categoryFilter, sortBy]);

  const isTransitioning = searchQuery !== deferredSearch || isPending;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">Our Product Collection</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Browse through premium items fetched dynamically from our local MongoDB database.
          </p>
        </div>

        {/* Filter Controls Panel */}
        <div className="bg-white border border-slate-100 shadow-xs rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input Box */}
            <div className="md:col-span-2">
              <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden px-4 py-3 focus-within:border-blue-600 focus-within:bg-white transition-all duration-200">
                <svg className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  className="w-full bg-transparent text-sm text-slate-800 focus:outline-hidden"
                  placeholder="Search products by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="text-slate-400 hover:text-slate-600 ml-2 cursor-pointer" 
                    onClick={() => setSearchQuery('')}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Sort Selector Dropdown */}
            <div>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-700 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all duration-200 cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort by: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rate-desc">Rating: High to Low</option>
                <option value="rate-asc">Rating: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category filtering chips */}
        <div className="flex flex-wrap gap-2 justify-center items-center mb-10">
          <span className="text-slate-500 font-semibold text-xs uppercase tracking-wider mr-2">Categories:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer text-capitalize ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat === 'all' ? 'All Products' : cat}
            </button>
          ))}
        </div>

        {/* Results stats row */}
        <div className="flex justify-between items-center mb-6">
          <h5 className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
            Showing {processedProducts.length} {processedProducts.length === 1 ? 'product' : 'products'}
          </h5>
          {isTransitioning && (
            <div className="flex items-center text-blue-600 gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <small className="font-semibold text-xs uppercase tracking-wider">Updating list...</small>
            </div>
          )}
        </div>

        {/* Grid layout */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-200"
          style={{ opacity: isTransitioning ? 0.7 : 1 }}
        >
          {processedProducts.length > 0 ? (
            processedProducts.map(product => (
              <div key={product._id} className="animate-fade-in">
                <ProductCard 
                  id={product._id}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  rating={product.rating}
                  category={product.category}
                  thumbnail={product.thumbnail}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-slate-100 p-8 shadow-xs">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              <h3 className="text-lg font-bold text-slate-800">No products found</h3>
              <p className="text-slate-500 text-xs mt-1">Try modifying your search query or choosing another category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsClientWrapper;
