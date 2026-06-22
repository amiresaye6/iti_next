import React, { useActionState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ProductForm = ({ product }) => {
  const router = useRouter();
  const isEditMode = !!product;

  const formActionHandler = async (prevState, formData) => {
    const rawData = Object.fromEntries(formData.entries());
    
    // Parse numeric values correctly
    const payload = {
      title: rawData.title,
      brand: rawData.brand,
      price: parseFloat(rawData.price),
      category: rawData.category.toLowerCase().trim(),
      stock: parseInt(rawData.stock || 0),
      rating: parseFloat(rawData.rating || 0),
      thumbnail: rawData.thumbnail,
      description: rawData.description,
      warrantyInformation: rawData.warrantyInformation || 'No warranty',
      shippingInformation: rawData.shippingInformation || 'Standard shipping',
      returnPolicy: rawData.returnPolicy || 'No returns',
    };

    // Client-side validation
    if (!payload.title || !payload.description || isNaN(payload.price) || !payload.category || !payload.thumbnail) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    const url = isEditMode ? `/api/products/${product._id}` : '/api/products';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Server error occurred.' };
      }

      // Success redirect
      router.push('/products');
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: 'Network error: ' + err.message };
    }
  };

  // React 19 useActionState hook
  const [state, formAction, isPending] = useActionState(formActionHandler, {
    success: false,
    error: null,
  });

  return (
    <div className="container py-5" style={{ maxWidth: '750px' }}>
      <div className="mb-4">
        <Link href="/products" className="btn btn-link text-decoration-none p-0 d-inline-flex align-items-center gap-1">
          <i className="bi bi-arrow-left"></i> Cancel and go back
        </Link>
      </div>

      <div className="card border-0 shadow-sm p-4 p-md-5 bg-white rounded-4">
        <h2 className="fw-bold text-dark mb-4 text-center">
          {isEditMode ? 'Edit Product Details' : 'Add New Product'}
        </h2>

        {state?.error && (
          <div className="alert alert-danger border-0 shadow-sm py-3 mb-4 rounded-3 d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-exclamation-triangle-fill fs-5"></i>
            <div>{state.error}</div>
          </div>
        )}

        <form action={formAction}>
          <div className="row g-3">
            {/* Title */}
            <div className="col-12">
              <label htmlFor="title" className="form-label fw-semibold text-secondary">Product Title <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control py-2 border-light-subtle"
                id="title"
                name="title"
                defaultValue={product?.title || ''}
                disabled={isPending}
                required
              />
            </div>

            {/* Brand */}
            <div className="col-md-6">
              <label htmlFor="brand" className="form-label fw-semibold text-secondary">Brand</label>
              <input
                type="text"
                className="form-control py-2 border-light-subtle"
                id="brand"
                name="brand"
                defaultValue={product?.brand || ''}
                disabled={isPending}
              />
            </div>

            {/* Category */}
            <div className="col-md-6">
              <label htmlFor="category" className="form-label fw-semibold text-secondary">Category <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control py-2 border-light-subtle"
                id="category"
                name="category"
                placeholder="e.g. beauty, laptops, furniture"
                defaultValue={product?.category || ''}
                disabled={isPending}
                required
              />
            </div>

            {/* Price */}
            <div className="col-md-4">
              <label htmlFor="price" className="form-label fw-semibold text-secondary">Price ($) <span className="text-danger">*</span></label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control py-2 border-light-subtle"
                id="price"
                name="price"
                defaultValue={product?.price || ''}
                disabled={isPending}
                required
              />
            </div>

            {/* Stock */}
            <div className="col-md-4">
              <label htmlFor="stock" className="form-label fw-semibold text-secondary">Stock Qty <span className="text-danger">*</span></label>
              <input
                type="number"
                min="0"
                className="form-control py-2 border-light-subtle"
                id="stock"
                name="stock"
                defaultValue={product?.stock !== undefined ? product.stock : 10}
                disabled={isPending}
                required
              />
            </div>

            {/* Rating */}
            <div className="col-md-4">
              <label htmlFor="rating" className="form-label fw-semibold text-secondary">Initial Rating</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="5"
                className="form-control py-2 border-light-subtle"
                id="rating"
                name="rating"
                defaultValue={product?.rating || 4.5}
                disabled={isPending}
              />
            </div>

            {/* Thumbnail URL */}
            <div className="col-12">
              <label htmlFor="thumbnail" className="form-label fw-semibold text-secondary">Thumbnail Image URL <span className="text-danger">*</span></label>
              <input
                type="url"
                className="form-control py-2 border-light-subtle"
                id="thumbnail"
                name="thumbnail"
                defaultValue={product?.thumbnail || 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp'}
                disabled={isPending}
                required
              />
            </div>

            {/* Description */}
            <div className="col-12">
              <label htmlFor="description" className="form-label fw-semibold text-secondary">Description <span className="text-danger">*</span></label>
              <textarea
                className="form-control border-light-subtle"
                id="description"
                name="description"
                rows="3"
                defaultValue={product?.description || ''}
                disabled={isPending}
                required
              ></textarea>
            </div>

            {/* Additional Info: Warranty */}
            <div className="col-md-4">
              <label htmlFor="warrantyInformation" className="form-label fw-semibold text-secondary">Warranty</label>
              <input
                type="text"
                className="form-control py-2 border-light-subtle"
                id="warrantyInformation"
                name="warrantyInformation"
                defaultValue={product?.warrantyInformation || '1 year warranty'}
                disabled={isPending}
              />
            </div>

            {/* Additional Info: Shipping */}
            <div className="col-md-4">
              <label htmlFor="shippingInformation" className="form-label fw-semibold text-secondary">Shipping</label>
              <input
                type="text"
                className="form-control py-2 border-light-subtle"
                id="shippingInformation"
                name="shippingInformation"
                defaultValue={product?.shippingInformation || 'Ships in 3-5 business days'}
                disabled={isPending}
              />
            </div>

            {/* Additional Info: Returns */}
            <div className="col-md-4">
              <label htmlFor="returnPolicy" className="form-label fw-semibold text-secondary">Return Policy</label>
              <input
                type="text"
                className="form-control py-2 border-light-subtle"
                id="returnPolicy"
                name="returnPolicy"
                defaultValue={product?.returnPolicy || '30 days return policy'}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-top d-flex gap-3">
            <button
              type="submit"
              className="btn btn-primary px-4 py-2 d-inline-flex align-items-center gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Saving changes...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle"></i>
                  {isEditMode ? 'Save Changes' : 'Create Product'}
                </>
              )}
            </button>
            <Link href="/products" className="btn btn-outline-secondary px-4 py-2">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
