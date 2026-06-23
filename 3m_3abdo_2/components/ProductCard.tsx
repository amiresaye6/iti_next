import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
}

const StarIcon = ({ type }: { type: 'full' | 'half' | 'empty' }) => {
  if (type === 'full') {
    return (
      <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );
  }
  if (type === 'half') {
    return (
      <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="half-star">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>
        <path fill="url(#half-star)" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-slate-200 fill-current" viewBox="0 0 24 24">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
};

const ProductCard = ({ id, title, description, price, rating, category, thumbnail }: ProductCardProps) => {
  const renderStars = (ratingVal: number) => {
    const stars = [];
    const fullStars = Math.floor(ratingVal);
    const hasHalf = ratingVal % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<StarIcon key={i} type="full" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<StarIcon key={i} type="half" />);
      } else {
        stars.push(<StarIcon key={i} type="empty" />);
      }
    }
    return stars;
  };

  return (
    <div className="group relative flex flex-col h-full bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1.5">
      {/* Thumbnail Wrapper */}
      <div className="relative w-full aspect-[4/3] bg-slate-50 flex items-center justify-center p-3 overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 25vw"
          className="object-contain p-2 w-full h-full transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
        <span className="absolute top-3 left-3 bg-white text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs border border-slate-100 uppercase tracking-wider">
          {category}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Rating Row */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex">
            {renderStars(rating)}
          </div>
          <span className="text-xs text-slate-500 font-semibold">({rating.toFixed(1)})</span>
        </div>

        {/* Title */}
        <h5 className="font-bold text-slate-900 text-base mb-1.5 truncate" title={title}>
          {title}
        </h5>

        {/* Description */}
        <p className="text-slate-500 text-xs mb-4 line-clamp-2 leading-relaxed h-[36px]">
          {description}
        </p>

        {/* Footer actions */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] block uppercase tracking-wider font-semibold">Price</span>
            <h4 className="text-lg font-extrabold text-blue-600">${price.toFixed(2)}</h4>
          </div>
          <div>
            <Link
              href={`/products/${id}`}
              className="text-xs font-semibold text-blue-600 hover:text-white border border-blue-600 hover:bg-blue-600 px-4 py-1.5 rounded-full transition-all duration-200 inline-flex items-center gap-1"
            >
              Details
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
