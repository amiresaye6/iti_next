import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
    const router = useRouter();

    return (
        <nav className="navbar navbar-expand navbar-light bg-white border-bottom shadow-sm py-3 sticky-top">
            <div className="container">
                <Link href="/" className="navbar-brand fw-bold fs-4 text-primary d-flex align-items-center gap-2">
                    <i className="bi bi-bag-heart-fill"></i>
                    <span>3M 3abdo</span>
                </Link>
                
                <div className="navbar-collapse justify-content-end">
                    <ul className="navbar-nav gap-3">
                        <li className="nav-item">
                            <Link 
                                href="/" 
                                className={`nav-link px-2 fw-semibold ${router.pathname === '/' ? 'text-primary' : 'text-secondary'}`}
                                style={router.pathname === '/' ? { borderBottom: '2px solid var(--bs-primary)' } : {}}
                            >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                href="/products" 
                                className={`nav-link px-2 fw-semibold ${router.pathname.startsWith('/products') ? 'text-primary' : 'text-secondary'}`}
                                style={router.pathname.startsWith('/products') ? { borderBottom: '2px solid var(--bs-primary)' } : {}}
                            >
                                Products
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;

