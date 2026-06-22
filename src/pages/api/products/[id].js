import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const product = await Product.findById(id);
        if (!product) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.status(200).json({ success: true, product });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        // Protect PUT route with NextAuth session verification
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          return res.status(401).json({ success: false, error: 'Unauthorized. Please sign in.' });
        }

        const product = await Product.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (!product) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.status(200).json({ success: true, product });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        // Protect DELETE route with NextAuth session verification
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
          return res.status(401).json({ success: false, error: 'Unauthorized. Please sign in.' });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
