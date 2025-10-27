import React, { useState, useRef } from 'react';

export default function InCardPlaylist({ item, playerState, onTrackSelect }) {
    const { isPlaying, currentTrack, activePlaylistId } = playerState;
    const isThisPlaylistActive = activePlaylistId === item.id;

    return (
        <div className="audio-player-container">
            <ul className="playlist">
                {item.tracks.map((track, index) => (
                    <li 
                        key={index} 
                        className={`playlist-item ${isThisPlaylistActive && currentTrack?.src === track.src ? 'active' : ''}`}
                        onClick={() => onTrackSelect(item, index)}
                    >
                        <span className="track-name">{track.title}</span>
                        {isThisPlaylistActive && currentTrack?.src === track.src && isPlaying && <i className="fas fa-volume-high"></i>}
                        {isThisPlaylistActive && currentTrack?.src === track.src && !isPlaying && <i className="fas fa-pause play-indicator"></i>}
                    </li>
                ))}
            </ul>
        </div>
    );
}

