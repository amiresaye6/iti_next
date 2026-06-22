import Link from 'next/link';
import Head from 'next/head';
import React from 'react';

const ErrorNotFound = () => {
    return (
        <>
            <Head>
                <title>Page Not Found | 3M 3abdo</title>
                <meta name="description" content="The page you are looking for does not exist on 3M 3abdo." />
            </Head>
            <div className="bg-light min-vh-100 d-flex flex-column align-items-center justify-content-center py-5">
                <div className="container text-center">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-5">
                            <div className="card border-0 shadow-sm p-5 bg-white rounded-4">
                                <div className="text-danger mb-4">
                                    <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '5rem' }}></i>
                                </div>
                                <h1 className="fw-bold text-dark display-5 mb-2">404</h1>
                                <h3 className="fw-semibold text-secondary mb-3">Page Not Found</h3>
                                <p className="text-muted mb-4">
                                    We&apos;re sorry, but the page you requested could not be found. It may have been moved or deleted.
                                </p>
                                <div className="d-grid">
                                    <Link href="/" className="btn btn-primary btn-lg rounded-pill shadow-sm">
                                        <i className="bi bi-house-door-fill me-2"></i> Go Back Home
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ErrorNotFound;

