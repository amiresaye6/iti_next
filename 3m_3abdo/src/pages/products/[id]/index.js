import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ProductDetails from '@/components/ProductDetails';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

const Index = ({ product }) => {
    const router = useRouter();

    if (router.isFallback) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="visually-hidden">Loading product...</span>
                    </div>
                    <h5 className="text-secondary fw-semibold">Loading product information...</h5>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
                <div className="text-center py-5">
                    <i className="bi bi-exclamation-triangle text-warning display-2 mb-3"></i>
                    <h2 className="text-dark fw-bold">Product not found</h2>
                    <p className="text-muted mb-4">The product you are looking for does not exist or has been removed.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{`${product.title} | 3M 3abdo Catalog`}</title>
                <meta name="description" content={product.description || `Read full details and view price, reviews, and warranty for ${product.title}.`} />
                <meta property="og:title" content={`${product.title} | 3M 3abdo`} />
                <meta property="og:description" content={product.description} />
                {product.thumbnail && <meta property="og:image" content={product.thumbnail} />}
            </Head>

            <div className="bg-light min-vh-100">
                <ProductDetails {...product} />
            </div>
        </>
    );
};

export default Index;

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking',
    };
}

export async function getStaticProps(context) {
    const { params } = context;
    await dbConnect();
    try {
        const productDoc = await Product.findById(params.id).lean();

        if (!productDoc) {
            return {
                notFound: true,
            };
        }

        const serializedProduct = JSON.parse(JSON.stringify(productDoc));

        return {
            props: {
                product: serializedProduct,
            },
            revalidate: 10, // Re-generate static page in background every 10 seconds (ISR)
        };
    } catch (error) {
        console.error(`Error in product dynamic getStaticProps (id: ${params.id}):`, error);
        return {
            notFound: true,
        };
    }
}
