'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  // Next.js App Router returns null for usePathname() on not-found error routes
  const isErrorRoute = pathname === null;

  if (isErrorRoute) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-xs py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-black text-blue-600 transition-transform duration-200 active:scale-95">
          {/* Custom Bag Icon with Heart Detail */}
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM12 11.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
          </svg>
          <span className="font-extrabold tracking-tight">ShopVibe</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-semibold pb-1 border-b-2 transition-all duration-200 ${
              pathname === '/' 
                ? 'text-blue-600 border-blue-600' 
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/products" 
            className={`text-sm font-semibold pb-1 border-b-2 transition-all duration-200 ${
              pathname.startsWith('/products') 
                ? 'text-blue-600 border-blue-600' 
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            Products
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
