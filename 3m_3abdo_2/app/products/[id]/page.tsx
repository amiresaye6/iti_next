import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import Product, { IProduct } from '@/models/Product';
import ProductGallery from '@/components/ProductGallery';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate dynamic SEO metadata based on fetched product details
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  await dbConnect();
  try {
    const product = await Product.findById(id).lean() as IProduct | null;
    if (!product) {
      return {
        title: 'Product Not Found | ShopVibe',
      };
    }
    return {
      title: `${product.title} | ShopVibe Catalog`,
      description: product.description,
    };
  } catch {
    return {
      title: 'Product Details | ShopVibe',
    };
  }
}

async function getProduct(id: string) {
  try {
    await dbConnect();
    const productDoc = await Product.findById(id).lean();
    if (!productDoc) return null;
    return JSON.parse(JSON.stringify(productDoc));
  } catch (error) {
    console.error(`Error fetching product ID ${id}:`, error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const renderStars = (ratingVal: number) => {
    const stars = [];
    const fullStars = Math.floor(ratingVal);
    const hasHalf = ratingVal % 1 >= 0.5;

    const fullStarSvg = (
      <svg key="f" className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );
    const halfStarSvg = (
      <svg key="h" className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 24 24">
        <defs>
          <linearGradient id="half-detail">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>
        <path fill="url(#half-detail)" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );
    const emptyStarSvg = (
      <svg key="e" className="w-4 h-4 text-slate-200 fill-current" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(React.cloneElement(fullStarSvg, { key: i }));
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(React.cloneElement(halfStarSvg, { key: i }));
      } else {
        stars.push(React.cloneElement(emptyStarSvg, { key: i }));
      }
    }
    return stars;
  };

  // Safe discount percentage calculation
  const originalPrice = product.price / (1 - (product.discountPercentage || 0) / 100);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/products" 
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12l7.5-7.5M3 12h18" />
            </svg>
            Back to Products
          </Link>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Image view */}
          <div className="md:col-span-5">
            <ProductGallery 
              thumbnail={product.thumbnail} 
              images={product.images} 
              title={product.title} 
            />
          </div>

          {/* Right Column: Information */}
          <div className="md:col-span-7 flex flex-col justify-center">
            {/* Badges Row */}
            <div className="flex flex-wrap gap-2 items-center mb-3">
              <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 text-xs font-semibold rounded-md uppercase tracking-wider">
                {product.category}
              </span>
              {product.brand && (
                <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 text-xs font-semibold rounded-md">
                  Brand: {product.brand}
                </span>
              )}
              {product.stock > 0 ? (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 text-xs font-semibold rounded-md inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  In Stock ({product.stock})
                </span>
              ) : (
                <span className="bg-rose-50 text-rose-700 border border-rose-100 px-3 py-1 text-xs font-semibold rounded-md">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-3">
              {product.title}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {renderStars(product.rating || 0)}
              </div>
              <span className="text-sm text-slate-500 font-semibold">
                ({product.rating ? product.rating.toFixed(1) : '0.0'}) rating
              </span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-3xl font-black text-blue-600">${product.price.toFixed(2)}</h2>
              {product.discountPercentage && (
                <>
                  <span className="text-slate-400 text-sm line-through">${originalPrice.toFixed(2)}</span>
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {product.discountPercentage.toFixed(0)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h5 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">Description</h5>
              <p className="text-slate-500 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Trust specs grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
              {/* Warranty */}
              {product.warrantyInformation && (
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Warranty</span>
                    <span className="text-xs font-semibold text-slate-800">{product.warrantyInformation}</span>
                  </div>
                </div>
              )}

              {/* Shipping */}
              {product.shippingInformation && (
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125a1.125 1.125 0 001.125-1.125V9.75" />
                  </svg>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Shipping</span>
                    <span className="text-xs font-semibold text-slate-800">{product.shippingInformation}</span>
                  </div>
                </div>
              )}

              {/* Return Policy */}
              {product.returnPolicy && (
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3" />
                  </svg>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Returns</span>
                    <span className="text-xs font-semibold text-slate-800">{product.returnPolicy}</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
