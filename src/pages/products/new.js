import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import ProductForm from '@/components/ProductForm';
import Head from 'next/head';

const NewProductPage = () => {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading session...</span>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') return null;

    return (
        <>
            <Head>
                <title>Add Product | ShopVibe Admin</title>
                <meta name="description" content="Add a new product to the ShopVibe catalog database." />
            </Head>
            <div className="bg-light min-vh-100 py-3">
                <ProductForm />
            </div>
        </>
    );
};

export default NewProductPage;
