import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import FeaturedCarousel from '@/components/FeaturedCarousel';

export const revalidate = 3600; // Cache and regenerate page in background every hour (ISR)

async function getFeaturedProducts() {
  try {
    await dbConnect();
    const productsDoc = await Product.find({}).limit(8).lean();
    return JSON.parse(JSON.stringify(productsDoc));
  } catch (error) {
    console.error('Error fetching featured products on landing page:', error);
    return [];
  }
}

export default async function LandingPage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-100 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="row grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Col */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-100 px-3 py-1 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 8.25c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75z" />
                </svg>
                Summer Sale — Up to 50% Off
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
                Elevate Your Style <br/>
                <span className="text-blue-600">Discover Your Vibe</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Explore our handpicked curation of essentials. From dermatologist-approved beauty serums to state-of-the-art tech gadgets, find quality items selected just for you.
              </p>
              <div className="flex flex-wrap justify-content-center lg:justify-start gap-4">
                <Link 
                  href="/products" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-full shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2"
                >
                  Shop Collection
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                  </svg>
                </Link>
                <Link 
                  href="/products" 
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold px-8 py-3.5 rounded-full shadow-xs transition-all duration-200"
                >
                  Browse Categories
                </Link>
              </div>
            </div>

            {/* Right Col */}
            <div className="hidden lg:block">
              <div className="relative mx-auto w-full max-w-[480px] aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 flex items-center justify-center p-6 group">
                <Image 
                  src={featuredProducts[0]?.thumbnail || 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp'} 
                  alt="Featured Product Collection"
                  fill
                  sizes="480px"
                  className="object-contain p-6 bg-slate-50 transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <div className="absolute bottom-0 left-0 w-full bg-slate-900/80 backdrop-blur-xs text-white p-6">
                  <h5 className="font-bold text-lg mb-0.5">New Arrivals In Store</h5>
                  <p className="text-xs text-slate-300">Curated from local catalogs for premium quality.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Value Propositions */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Delivery */}
            <div className="flex flex-col items-center p-4">
              <div className="bg-blue-50 text-blue-600 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125a1.125 1.125 0 001.125-1.125V9.75M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125a1.125 1.125 0 001.125-1.125V9.75M16.5 18.75a1.5 1.5 0 00-3 0m3 0h-3M16.5 18.75a1.5 1.5 0 01-3 0m3 0h-3M3.75 6h16.5M3.75 9h16.5M3.75 12h16.5" />
                </svg>
              </div>
              <h5 className="font-bold text-slate-900 mb-1">Free Delivery</h5>
              <p className="text-slate-500 text-xs max-w-xs leading-normal">On all domestic orders over $50. Packaged with care.</p>
            </div>

            {/* Secure Payment */}
            <div className="flex flex-column items-center p-4 flex flex-col">
              <div className="bg-emerald-50 text-emerald-600 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h5 className="font-bold text-slate-900 mb-1">Secure Checkout</h5>
              <p className="text-slate-500 text-xs max-w-xs leading-normal">Fully encrypted PCI-compliant payment gateways.</p>
            </div>

            {/* Guarantee */}
            <div className="flex flex-column items-center p-4 flex flex-col">
              <div className="bg-cyan-50 text-cyan-600 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3M3 12c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M3 12l-3 3m3-3l3 3" />
                </svg>
              </div>
              <h5 className="font-bold text-slate-900 mb-1">30-Day Returns</h5>
              <p className="text-slate-500 text-xs max-w-xs leading-normal">Hassle-free sizing exchanges or refunds within 30 days.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FeaturedCarousel products={featuredProducts} />
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">Join the Vibe Club</h3>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-md mx-auto">
            Subscribe to receive early notifications for flash sales, exclusive discounts, and new collection launches.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-3">
            <input 
              type="email" 
              className="flex-grow px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-all duration-200" 
              placeholder="Enter your email address" 
              aria-label="Email address"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg text-sm shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer">
              Subscribe
            </button>
          </div>
          <small className="text-slate-400 text-[10px]">Unsubscribe at any time. We respect your inbox privacy.</small>
        </div>
      </section>
    </div>
  );
}
