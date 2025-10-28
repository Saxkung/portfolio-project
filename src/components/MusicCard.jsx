import React, { useState, useRef } from 'react';
import InCardPlaylist from './InCardPlaylist';

function MusicCardComponent({ item, playerState, onTrackSelect }) {
    const [isPlayerVisible, setIsPlayerVisible] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const startPos = useRef({ x: 0, y: 0 });
    const dragTimeout = useRef(null);
    
    const togglePlayerVisibility = () => {
        setIsPlayerVisible(prev => !prev);
    };

    const handleMouseDown = (e) => {
        startPos.current = { x: e.clientX, y: e.clientY };
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!startPos.current) return;
        
        const deltaX = Math.abs(e.clientX - startPos.current.x);
        const deltaY = Math.abs(e.clientY - startPos.current.y);

        // ถ้าเคลื่อนที่มากกว่า 3px ถือว่าเป็นการลาก
        if (deltaX > 3 || deltaY > 3) {
            setIsDragging(true);
        }
    };

    const handleMouseUp = () => {
        if (dragTimeout.current) {
            clearTimeout(dragTimeout.current);
        }
        dragTimeout.current = setTimeout(() => {
            setIsDragging(false);
            startPos.current = null;
        }, 100);
    };

    const handleCardClick = (e) => {
        if (e.target.closest('.audio-player-wrapper') || isDragging) {
            return;
        }
        togglePlayerVisibility();
    };

    return (
        <div className="card-wrapper">
            <div 
                className={`music-card ${isPlayerVisible ? 'player-visible' : ''}`}
                onClick={handleCardClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick(e);
                    }
                }}
            >
                <img src={item.image} className="music-card-img" alt={item.title} loading="lazy" decoding="async" />
                <div className="music-card-body">
                    <h4 className="mb-2">{item.title}</h4>
                    <p className="text-muted">{item.description}</p>
                    <div className={`audio-player-wrapper ${isPlayerVisible ? 'show' : ''}`}>
                       <InCardPlaylist 
                            item={item}
                            playerState={playerState}
                            onTrackSelect={onTrackSelect}
                        />
                    </div>
                </div>
                <div className="card-overlay">
                    <i className={`fas ${isPlayerVisible ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </div>
            </div>
        </div>
    );
}

const MusicCard = React.memo(MusicCardComponent);
export default MusicCard;

