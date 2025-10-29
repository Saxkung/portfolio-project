import React from 'react';

export default function HeroSection() {
    return (
        <section className="hero-section">
            <video autoPlay loop muted playsInline className="hero-bg-video">
                <source src="/assets/Bg/bg_2.webm" type="video/webm" />
            </video>
            
            <div className="container">
                <h1 className="text-white display-3">Panuwat Sarapat</h1>
                <p className="lead">"Composing a melodic tapestry that narrates a compelling story."</p>
            </div>
        </section>
    );
}

