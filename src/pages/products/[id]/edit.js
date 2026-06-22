import React from 'react';
import ProductForm from '@/components/ProductForm';
import Head from 'next/head';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]';

const EditProductPage = ({ product }) => {
    return (
        <>
            <Head>
                <title>{`Edit ${product.title} | ShopVibe Admin`}</title>
                <meta name="description" content={`Edit product details for ${product.title}.`} />
            </Head>
            <div className="bg-light min-vh-100 py-3">
                <ProductForm product={product} />
            </div>
        </>
    );
};

export default EditProductPage;

// Server-side authentication and product pre-fetching
export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);
    
    // Redirect to sign in if not authenticated
    if (!session) {
        return {
            redirect: {
                destination: '/api/auth/signin',
                permanent: false,
            },
        };
    }

    const { id } = context.params;
    await dbConnect();
    
    try {
        const productDoc = await Product.findById(id).lean();
        if (!productDoc) {
            return {
                notFound: true,
            };
        }
        
        // Serialize ObjectId and Date fields into clean JSON
        const serializedProduct = JSON.parse(JSON.stringify(productDoc));

        return {
            props: {
                product: serializedProduct,
            },
        };
    } catch (error) {
        console.error('Error fetching product for editing:', error);
        return {
            notFound: true,
        };
    }
}
