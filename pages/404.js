// pages/404.js
import React from 'react';

const Custom404 = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1 style={{ fontSize: '3rem', color: '#FF6347' }}>404</h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Oops! Page Not Found</p>
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

export default Custom404;
