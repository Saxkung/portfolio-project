import React from 'react';

export default function Preloader({ isFading }) {
    return (
        <div className={`preloader ${isFading ? 'fade-out' : ''}`}>
            <div className="preloader-logo"></div>
            <div className="spinner"></div>
        </div>
    );
}

