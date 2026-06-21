import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ProductDetails = ({ 
    id, 
    title, 
    description, 
    price, 
    discountPercentage, 
    rating = 0, 
    stock = 0, 
    brand, 
    category, 
    thumbnail, 
    images = [], 
    warrantyInformation, 
    shippingInformation, 
    returnPolicy 
}) => {
    const [activeImage, setActiveImage] = useState(thumbnail || (images && images[0]) || '');

    const renderStars = (ratingVal) => {
        const stars = [];
        const fullStars = Math.floor(ratingVal);
        const hasHalf = ratingVal % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<i key={i} className="bi bi-star-fill text-warning me-1"></i>);
            } else if (i === fullStars + 1 && hasHalf) {
                stars.push(<i key={i} className="bi bi-star-half text-warning me-1"></i>);
            } else {
                stars.push(<i key={i} className="bi bi-star text-muted me-1"></i>);
            }
        }
        return stars;
    };

    const originalPrice = discountPercentage 
        ? price / (1 - discountPercentage / 100) 
        : price;

    return (
        <div className="container py-5">
            <div className="mb-4">
                <Link href="/products" className="btn btn-link text-decoration-none p-0 d-inline-flex align-items-center gap-1">
                    <i className="bi bi-arrow-left"></i> Back to Products
                </Link>
            </div>
            
            <div className="row g-5">
                {/* Left: Images Column */}
                <div className="col-md-6 col-lg-5">
                    <div className="card border-0 shadow-sm p-4 bg-white mb-3 rounded-4">
                        <div className="position-relative w-100" style={{ height: '380px' }}>
                            <Image 
                                src={activeImage} 
                                alt={title} 
                                fill
                                sizes="(max-width: 768px) 100vw, 500px"
                                className="object-fit-contain" 
                                priority
                            />
                        </div>
                    </div>
                    {images && images.length > 1 && (
                        <div className="d-flex gap-2 overflow-x-auto pb-2">
                            {images.map((img, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`btn p-1 bg-white border rounded-3 shadow-sm flex-shrink-0 position-relative ${activeImage === img ? 'border-primary border-2' : ''}`}
                                    style={{ width: '70px', height: '70px' }}
                                >
                                    <div className="position-relative w-100 h-100">
                                        <Image 
                                            src={img} 
                                            alt={`${title} gallery ${idx}`} 
                                            fill 
                                            sizes="70px" 
                                            className="object-fit-contain" 
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Right: Info Column */}
                <div className="col-md-6 col-lg-7">
                    <div className="d-flex flex-wrap gap-2 mb-2 align-items-center">
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle text-capitalize">
                            {category}
                        </span>
                        {brand && (
                            <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
                                Brand: {brand}
                            </span>
                        )}
                        {stock > 0 ? (
                            <span className="badge bg-success-subtle text-success border border-success-subtle">
                                <i className="bi bi-check-circle-fill me-1"></i> In Stock ({stock})
                            </span>
                        ) : (
                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                                Out of Stock
                            </span>
                        )}
                    </div>
                    
                    <h1 className="fw-bold text-dark mb-3">{title}</h1>
                    
                    <div className="d-flex align-items-center mb-4">
                        <div className="d-flex me-2">
                            {renderStars(rating)}
                        </div>
                        <span className="text-secondary fw-semibold">({rating ? rating.toFixed(1) : '0.0'}) rating</span>
                    </div>
                    
                    <div className="d-flex align-items-baseline gap-3 mb-4">
                        <h2 className="fw-bold text-primary mb-0">${price ? price.toFixed(2) : '0.00'}</h2>
                        {discountPercentage && (
                            <>
                                <span className="text-muted text-decoration-line-through">${originalPrice.toFixed(2)}</span>
                                <span className="badge bg-danger">{discountPercentage.toFixed(0)}% OFF</span>
                            </>
                        )}
                    </div>
                    
                    <div className="mb-4">
                        <h5 className="fw-bold text-dark mb-2">Description</h5>
                        <p className="text-muted leading-relaxed">{description}</p>
                    </div>
                    
                    <div className="row g-3 border-top pt-4">
                        {warrantyInformation && (
                            <div className="col-sm-6">
                                <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3">
                                    <i className="bi bi-shield-check text-primary fs-3"></i>
                                    <div>
                                        <span className="d-block text-muted small fw-medium">Warranty</span>
                                        <span className="text-dark fw-semibold">{warrantyInformation}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {shippingInformation && (
                            <div className="col-sm-6">
                                <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3">
                                    <i className="bi bi-truck text-primary fs-3"></i>
                                    <div>
                                        <span className="d-block text-muted small fw-medium">Shipping</span>
                                        <span className="text-dark fw-semibold">{shippingInformation}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {returnPolicy && (
                            <div className="col-sm-6">
                                <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3">
                                    <i className="bi bi-arrow-left-right text-primary fs-3"></i>
                                    <div>
                                        <span className="d-block text-muted small fw-medium">Return Policy</span>
                                        <span className="text-dark fw-semibold">{returnPolicy}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
