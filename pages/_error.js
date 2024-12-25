// pages/_error.js
import React from 'react';

const ErrorPage = ({ statusCode }) => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1 style={{ fontSize: '3rem', color: '#FF6347' }}>
                {statusCode ? `Error ${statusCode}` : 'An error occurred'}
            </h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
                {statusCode === 404
                    ? 'Page Not Found'
                    : 'Something went wrong. Please try again later.'}
            </p>
            <a
                href="/"
                style={{
                    textDecoration: 'none',
                    color: '#0070f3',
                    fontWeight: 'bold',
                }}
            >
                Go Back Home
            </a>
        </div>
    );
};

// Fetch status code from the server or error object
ErrorPage.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default ErrorPage;
