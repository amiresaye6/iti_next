import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';

const Header = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    return (
        <nav className="navbar navbar-expand navbar-light bg-white border-bottom shadow-sm py-3 sticky-top">
            <div className="container">
                <Link href="/" className="navbar-brand fw-bold fs-4 text-primary d-flex align-items-center gap-2">
                    <i className="bi bi-bag-heart-fill"></i>
                    <span>ShopVibe</span>
                </Link>
                
                <div className="navbar-collapse justify-content-end align-items-center">
                    <ul className="navbar-nav gap-3 mb-0 align-items-center">
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
                        
                        {status === 'authenticated' ? (
                            <li className="nav-item d-flex align-items-center gap-3 ms-2 border-start ps-3">
                                <div className="d-flex align-items-center gap-2">
                                    {session.user.image ? (
                                        <img 
                                            src={session.user.image} 
                                            alt={session.user.name || 'User'} 
                                            className="rounded-circle"
                                            style={{ width: '32px', height: '32px' }}
                                        />
                                    ) : (
                                        <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                                            {(session.user.name || session.user.email || 'U')[0].toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-dark fw-medium small d-none d-sm-inline">{session.user.name || session.user.email}</span>
                                </div>
                                <button 
                                    onClick={() => signOut({ callbackUrl: '/' })} 
                                    className="btn btn-outline-danger btn-sm px-3 rounded-pill"
                                >
                                    Sign Out
                                </button>
                            </li>
                        ) : (
                            <li className="nav-item ms-2 border-start ps-3">
                                <button 
                                    onClick={() => signIn()} 
                                    className="btn btn-primary btn-sm px-4 rounded-pill"
                                >
                                    Sign In
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
