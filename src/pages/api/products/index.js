import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, products });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        // Protect POST route with NextAuth session verification
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          return res.status(401).json({ success: false, error: 'Unauthorized. Please sign in.' });
        }

        // Validate body fields
        const { title, description, price, category, thumbnail } = req.body;
        if (!title || !description || !price || !category || !thumbnail) {
          return res.status(400).json({ success: false, error: 'Missing required product fields.' });
        }

        const product = await Product.create(req.body);
        res.status(201).json({ success: true, product });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
