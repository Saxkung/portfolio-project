import React from 'react';
import DraggableRow from './DraggableRow';
import MusicCard from './MusicCard';
import AnimateOnScroll from './AnimateOnScroll';

export default function PortfolioSection({ playerState, onTrackSelect, portfolioData }) {
    return (
        <section id="portfolio" className="section">
            <div className="container">
                <AnimateOnScroll><h2 className="section-title fade-up">Work</h2></AnimateOnScroll>
                {portfolioData.map((categoryData, index) => (
                    <div key={index} className="mb-5">
                        <AnimateOnScroll>
                            <h3 className="category-title fade-up" style={{transitionDelay: `${index * 100}ms`}}>{categoryData.category}</h3>
                        </AnimateOnScroll>
                         <AnimateOnScroll className="stagger-in">
                            <DraggableRow>
                                {categoryData.items.map(item => 
                                    <MusicCard 
                                        key={item.id} 
                                        item={item} 
                                        playerState={playerState}
                                        onTrackSelect={onTrackSelect}
                                    />
                                )}
                            </DraggableRow>
                        </AnimateOnScroll>
                    </div>
                ))}
            </div>
        </section>
    );
}

