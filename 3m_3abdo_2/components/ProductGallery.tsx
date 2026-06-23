'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  thumbnail: string;
  images: string[];
  title: string;
}

const ProductGallery = ({ thumbnail, images = [], title }: ProductGalleryProps) => {
  const [activeImage, setActiveImage] = useState(thumbnail || images[0] || '');

  return (
    <div className="flex flex-col gap-4">
      {/* Main Active Image Box */}
      <div className="relative w-full aspect-square md:aspect-[4/3] bg-white border border-slate-100 shadow-xs p-6 rounded-3xl flex items-center justify-center overflow-hidden">
        <Image 
          src={activeImage} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, 500px" 
          className="object-contain p-6"
          priority
        />
      </div>

      {/* Dynamic Gallery Thumbnails */}
      {images && images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scroll-container">
          {images.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`relative flex-shrink-0 w-16 h-16 bg-white border rounded-xl overflow-hidden shadow-xs cursor-pointer transition-all duration-200 ${
                activeImage === img 
                  ? 'border-blue-600 border-2' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="relative w-full h-full p-1 bg-slate-50">
                <Image 
                  src={img} 
                  alt={`${title} gallery ${idx}`} 
                  fill 
                  sizes="64px" 
                  className="object-contain p-1" 
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
