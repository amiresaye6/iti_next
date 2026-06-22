import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

const Index = ({ featuredProducts = [], randomQuote }) => {
  const [showToast, setShowToast] = useState(true);

  const scrollLeft = () => {
    const lane = document.getElementById('featured-lane');
    if (lane) lane.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const lane = document.getElementById('featured-lane');
    if (lane) lane.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>ShopVibe | Trendy Products & Modern Aesthetics</title>
        <meta name="description" content="Discover the latest collection of premium beauty, electronics, fragrances, and home products at ShopVibe. Fast shipping & easy returns." />
      </Head>

      <div className="bg-light min-vh-100 position-relative">
        {/* Random Quote Toast Notification (SSR requirement) */}
        {showToast && randomQuote && (
          <div 
            className="position-fixed bottom-0 end-0 m-4 p-3 toast show bg-white border border-light-subtle shadow-lg rounded-4 animate-fade-in" 
            style={{ zIndex: 1060, maxWidth: '350px', transition: 'all 0.3s ease' }} 
            role="alert"
          >
            <div className="toast-header border-bottom-0 pb-1 bg-transparent d-flex justify-content-between align-items-center">
              <strong className="me-auto text-primary d-flex align-items-center gap-2">
                <i className="bi bi-chat-quote-fill fs-5"></i>
                <span>Daily Inspiration</span>
              </strong>
              <button 
                type="button" 
                onClick={() => setShowToast(false)} 
                className="btn-close" 
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body text-secondary pt-1 pb-1 fs-6 lh-sm" style={{ fontStyle: 'italic' }}>
              "{randomQuote.quote}"
              <div className="text-end fw-semibold text-dark mt-2 small" style={{ fontStyle: 'normal' }}>
                — {randomQuote.author}
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="bg-white border-bottom py-5">
          <div className="container py-4">
            <div className="row align-items-center g-5">
              <div className="col-lg-6 text-center text-lg-start">
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2 rounded-pill mb-3 fw-semibold uppercase tracking-wider">
                  <i className="bi bi-tag-fill me-1"></i> Summer Sale — Up to 50% Off
                </span>
                <h1 className="display-4 fw-bold text-dark mb-4 lh-sm">
                  Elevate Your Style <br/>
                  <span className="text-primary">Discover Your Vibe</span>
                </h1>
                <p className="lead text-secondary mb-5">
                  Explore our handpicked curation of essentials. From dermatologist-approved beauty serums to state-of-the-art tech gadgets, find quality items selected just for you.
                </p>
                <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3">
                  <Link href="/products" className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-sm">
                    Shop Collection <i className="bi bi-bag-fill ms-2"></i>
                  </Link>
                  <Link href="/products" className="btn btn-outline-secondary btn-lg px-5 py-3 rounded-pill">
                    Browse Categories
                  </Link>
                </div>
              </div>
              <div className="col-lg-6 d-none d-lg-block">
                <div className="position-relative mx-auto rounded-4 overflow-hidden shadow-lg" style={{ height: '400px', maxWidth: '500px' }}>
                  <Image 
                    src={featuredProducts[0]?.thumbnail || 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp'} 
                    alt="Featured Collection" 
                    fill 
                    className="object-fit-contain p-4 bg-light"
                    priority
                  />
                  <div className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-70 text-white p-4 backdrop-blur">
                    <h5 className="fw-bold mb-1">New Arrivals In Store</h5>
                    <p className="small mb-0 text-white-50">Curated from local catalogs for premium quality.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Value Props (Trust Badges) */}
        <section className="py-5 bg-white border-bottom">
          <div className="container">
            <div className="row g-4 text-center">
              <div className="col-md-4">
                <div className="d-flex flex-column align-items-center p-3">
                  <div className="bg-primary-subtle text-primary rounded-circle p-3 mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-truck fs-3"></i>
                  </div>
                  <h5 className="fw-bold text-dark mb-1">Free Delivery</h5>
                  <p className="text-secondary small mb-0">On all domestic orders over $50. Packaged with care.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex flex-column align-items-center p-3">
                  <div className="bg-success-subtle text-success rounded-circle p-3 mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-shield-check fs-3"></i>
                  </div>
                  <h5 className="fw-bold text-dark mb-1">Secure Checkout</h5>
                  <p className="text-secondary small mb-0">Fully encrypted PCI-compliant payment gateways.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex flex-column align-items-center p-3">
                  <div className="bg-info-subtle text-info rounded-circle p-3 mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-arrow-left-right fs-3"></i>
                  </div>
                  <h5 className="fw-bold text-dark mb-1">30-Day Returns</h5>
                  <p className="text-secondary small mb-0">Hassle-free sizing exchanges or refunds within 30 days.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Carousel */}
        {featuredProducts.length > 0 && (
          <section className="py-5">
            <div className="container">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <span className="text-primary fw-semibold small uppercase tracking-wider d-block">Curated Selection</span>
                  <h2 className="fw-bold text-dark mb-0">Trending Products</h2>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    onClick={scrollLeft} 
                    className="btn btn-white bg-white border border-light-subtle rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: '45px', height: '45px' }}
                    aria-label="Scroll left"
                  >
                    <i className="bi bi-chevron-left text-dark"></i>
                  </button>
                  <button 
                    onClick={scrollRight} 
                    className="btn btn-white bg-white border border-light-subtle rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: '45px', height: '45px' }}
                    aria-label="Scroll right"
                  >
                    <i className="bi bi-chevron-right text-dark"></i>
                  </button>
                </div>
              </div>

              {/* Slider Container */}
              <div 
                id="featured-lane" 
                className="d-flex overflow-x-auto gap-4 pb-4 px-1 scroll-container"
              >
                {featuredProducts.map(product => (
                  <div key={product._id} className="flex-shrink-0" style={{ width: '285px' }}>
                    <ProductCard {...product} id={product._id} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Promotional Banner Callout */}
        <section className="py-5 bg-white border-top">
          <div className="container text-center py-4">
            <div className="row justify-content-center">
              <div className="col-lg-7">
                <h3 className="fw-bold text-dark mb-3">Join the Vibe Club</h3>
                <p className="text-secondary mb-4">Subscribe to receive early notifications for flash sales, exclusive discounts, and new collection launches.</p>
                <div className="input-group mb-3 max-width-md mx-auto" style={{ maxWidth: '500px' }}>
                  <input type="email" className="form-control py-3 border-light-subtle" placeholder="Enter your email address" aria-label="Recipient's email" />
                  <button className="btn btn-primary px-4" type="button">Subscribe</button>
                </div>
                <small className="text-secondary-50">Unsubscribe at any time. We respect your inbox privacy.</small>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;

// Server-Side Rendering (SSR) to fetch featured products and a random quote dynamically
export async function getServerSideProps() {
  await dbConnect();
  
  let featuredProducts = [];
  let randomQuote = null;
  
  try {
    const productsDoc = await Product.find({}).limit(8).lean();
    featuredProducts = JSON.parse(JSON.stringify(productsDoc));
  } catch (e) {
    console.error("Error fetching landing page featured products:", e);
  }
  
  try {
    // Fetch random quote dynamically
    const res = await fetch("https://dummyjson.com/quotes/random");
    if (res.ok) {
      randomQuote = await res.json();
    }
  } catch (e) {
    console.error("Error fetching random quote in SSR:", e);
  }
  
  return {
    props: {
      featuredProducts: featuredProducts || [],
      randomQuote: randomQuote || null,
    },
  };
}
