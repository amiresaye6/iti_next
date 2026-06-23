'use client';

import React from 'react';
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

interface FeaturedCarouselProps {
  products: ProductData[];
}

const FeaturedCarousel = ({ products }: FeaturedCarouselProps) => {
  const scrollLeft = () => {
    const lane = document.getElementById('featured-lane');
    if (lane) lane.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const lane = document.getElementById('featured-lane');
    if (lane) lane.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-blue-600 font-semibold text-xs uppercase tracking-wider block mb-1">Curated Selection</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Trending Products</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={scrollLeft} 
            className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-xs text-slate-600 hover:text-blue-600 transition-all duration-200 active:scale-90 cursor-pointer"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button 
            onClick={scrollRight} 
            className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-xs text-slate-600 hover:text-blue-600 transition-all duration-200 active:scale-90 cursor-pointer"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      <div 
        id="featured-lane" 
        className="flex flex-row overflow-x-auto gap-6 pb-4 px-1 scroll-container"
      >
        {products.map((product) => (
          <div key={product._id} className="flex-shrink-0 w-[285px]">
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
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
