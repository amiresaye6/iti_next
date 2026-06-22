import React, { useState, useDeferredValue, useTransition, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import ProductCard from '@/components/ProductCard';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

const ProductsIndex = ({ products = [] }) => {
    const { status } = useSession();
    const hasSession = status === 'authenticated';

    const [searchQuery, setSearchQuery] = useState('');
    const deferredSearch = useDeferredValue(searchQuery);

    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isPending, startTransition] = useTransition();

    const [sortBy, setSortBy] = useState('default');

    // Get unique categories dynamically
    const categories = useMemo(() => {
        const unique = new Set(products.map(p => p.category));
        return ['all', ...Array.from(unique)];
    }, [products]);

    const handleCategorySelect = (category) => {
        startTransition(() => {
            setCategoryFilter(category);
        });
    };

    // Filter and sort the complete list
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
                if (sortBy === 'rate-desc') return b.rating - a.rating;
                if (sortBy === 'rate-asc') return a.rating - b.rating;
                return 0;
            });
    }, [products, deferredSearch, categoryFilter, sortBy]);

    // Gating rule: Guest users see only 1 row of products (up to 4)
    const displayedProducts = hasSession
        ? processedProducts
        : processedProducts.slice(0, 4);

    const isTransitioning = searchQuery !== deferredSearch || isPending;

    return (
        <>
            <Head>
                <title>All Products | ShopVibe Catalog</title>
                <meta name="description" content="Explore ShopVibe's wide selection of products from laptops to groceries. Filter by category, search instantly, and sort by price and rating." />
            </Head>
            <div className="bg-light min-vh-100 py-5">
                <div className="container">
                    
                    {/* Header Action Row (Only for signed-in admins) */}
                    {hasSession && (
                        <div className="card border-0 shadow-sm p-4 bg-white rounded-4 mb-5 d-flex flex-sm-row justify-content-between align-items-center gap-3">
                            <div>
                                <h3 className="fw-bold text-dark mb-0">Management Portal</h3>
                                <p className="text-muted small mb-0">You have full admin credentials to manage products in the catalog database.</p>
                            </div>
                            <Link href="/products/new" className="btn btn-success rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2 shadow-sm">
                                <i className="bi bi-plus-circle-fill"></i> Add Product
                            </Link>
                        </div>
                    )}

                    {/* Guest Callout Banner (Only for anonymous guests) */}
                    {!hasSession && (
                        <div className="card border-0 bg-primary-subtle text-primary p-4 rounded-4 shadow-sm mb-5 border-start border-primary border-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                <div>
                                    <h4 className="fw-bold mb-1">
                                        <i className="bi bi-gift-fill me-2 text-primary"></i> Unlock Full Catalog Access
                                    </h4>
                                    <p className="mb-0 text-dark opacity-75">
                                        You are currently viewing a limited guest preview. Sign in to view all 30+ products and gain add/edit/delete admin controls!
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button onClick={() => signIn()} className="btn btn-primary rounded-pill px-4 py-2 fw-semibold">
                                        Sign In Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search & Sort Panel */}
                    <div className="card border-0 shadow-sm p-4 bg-white rounded-4 mb-4">
                        <div className="row g-3">
                            {/* Search Input */}
                            <div className="col-md-8">
                                <div className="input-group input-group-lg border rounded-3 overflow-hidden">
                                    <span className="input-group-text bg-white border-0 text-muted">
                                        <i className="bi bi-search"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-0 ps-0"
                                        placeholder="Search products by title or description..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <button
                                            className="btn bg-white border-0 text-muted"
                                            onClick={() => setSearchQuery('')}
                                        >
                                            <i className="bi bi-x-circle-fill"></i>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Sort Selector */}
                            <div className="col-md-4">
                                <select
                                    className="form-select form-select-lg border rounded-3"
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

                    {/* Category Filtering Chips */}
                    <div className="d-flex flex-wrap gap-2 justify-content-center mb-5 align-items-center">
                        <span className="text-secondary fw-semibold me-2 small uppercase">Categories:</span>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategorySelect(cat)}
                                className={`btn rounded-pill px-3 py-1 text-capitalize border-0 ${categoryFilter === cat
                                    ? 'btn-primary text-white shadow-sm'
                                    : 'btn-white bg-white text-secondary shadow-sm'
                                    }`}
                            >
                                {cat === 'all' ? 'All Products' : cat}
                            </button>
                        ))}
                    </div>

                    {/* Results count & status loader */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="text-secondary mb-0 fw-medium">
                            Showing {displayedProducts.length} of {processedProducts.length} {processedProducts.length === 1 ? 'product' : 'products'}
                        </h5>
                        {isTransitioning && (
                            <div className="d-flex align-items-center text-primary gap-2">
                                <span className="spinner-border spinner-border-sm" role="status"></span>
                                <small className="fw-medium">Updating list...</small>
                            </div>
                        )}
                    </div>

                    {/* Products Grid */}
                    <div
                        className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 transition-all"
                        style={{ opacity: isTransitioning ? 0.7 : 1, transition: 'opacity 0.2s ease' }}
                    >
                        {displayedProducts.length > 0 ? (
                            displayedProducts.map(product => (
                                <div className="col animate-fade-in" key={product._id}>
                                    <ProductCard {...product} id={product._id} />
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <i className="bi bi-inbox text-muted display-1 mb-3"></i>
                                <h3 className="text-dark">No products found</h3>
                                <p className="text-muted">Try adjusting your search filters or clear inputs.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductsIndex;

// Incremental Static Regeneration (ISR) from local MongoDB database
export async function getStaticProps() {
    await dbConnect();
    try {
        const productsDoc = await Product.find({}).sort({ createdAt: -1 }).lean();
        
        // Serialize ObjectId and Dates to strings
        const serializedProducts = JSON.parse(JSON.stringify(productsDoc));

        return {
            props: {
                products: serializedProducts || [],
            },
            revalidate: 10, // Re-generate static page in background every 10 seconds (ISR)
        };
    } catch (error) {
        console.error("Error in products list getStaticProps:", error);
        return {
            props: {
                products: [],
            },
            revalidate: 10,
        };
    }
}
