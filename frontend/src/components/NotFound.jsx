import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="position-absolute top-50 start-50 translate-middle text-center">
            <h1 className="display-3 text-danger">404</h1>
            <h2 className="text-muted">Page Not Found</h2>
            <p>The page you are looking for doesn't exist.</p>
            <Link to="/" className="btn btn-primary mt-3">Go Back Home</Link>
        </div>
    );
};

export default NotFound;
