// src/components/ErrorComponent.js
import React from 'react';

const ErrorComponent = ({ errorMessage }) => {
    return (
        <div className="error">
            <p>{errorMessage}</p>
        </div>
    );
};

export default ErrorComponent;