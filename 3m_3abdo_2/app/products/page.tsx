import React from 'react';
import { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductsClientWrapper from '@/components/ProductsClientWrapper';

export const metadata: Metadata = {
  title: 'Catalog | ShopVibe Catalog',
  description: 'Search, filter, and discover premium beauty products, laptops, and home decor at ShopVibe.',
};

export const revalidate = 10; // Regenerate this page in the background every 10 seconds (ISR)

async function getProducts() {
  try {
    await dbConnect();
    const productsDoc = await Product.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(productsDoc));
  } catch (error) {
    console.error('Error in getStaticProps products data fetch:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <ProductsClientWrapper products={products} />
  );
}
