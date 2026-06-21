import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ProductCard = ({ id, title, description, price, rating, category, thumbnail }) => {
    // Generate star icons based on rating value
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

    return (
        <div className="card h-100 border-0 shadow-sm hover-card bg-white">
            <div className="position-relative bg-light">
                <div className="position-relative w-100" style={{ height: '220px' }}>
                    <Image 
                        src={thumbnail} 
                        alt={title} 
                        fill
                        sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 25vw"
                        className="object-fit-contain p-2"
                        priority={id <= 4}
                    />
                </div>
                <span className="position-absolute top-0 start-0 m-3 badge bg-white text-dark shadow-sm text-capitalize border">
                    {category}
                </span>
            </div>
            
            <div className="card-body d-flex flex-column p-4">
                <div className="d-flex align-items-center mb-2">
                    <div className="d-flex me-2">
                        {renderStars(rating)}
                    </div>
                    <span className="text-secondary small fw-medium">({rating.toFixed(1)})</span>
                </div>
                
                <h5 className="card-title fw-bold text-dark mb-2 text-truncate" title={title}>
                    {title}
                </h5>
                
                <p 
                    className="card-text text-muted mb-4 small" 
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '38px'
                    }}
                >
                    {description}
                </p>
                
                <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                    <div>
                        <span className="text-muted small d-block">Price</span>
                        <h4 className="fw-bold text-primary mb-0">${price.toFixed(2)}</h4>
                    </div>
                    <div>
                        <Link href={`/products/${id}`} className="btn btn-outline-primary btn-sm px-3 rounded-pill">
                            Details <i className="bi bi-arrow-right ms-1"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
