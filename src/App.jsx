import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import WaveSurfer from 'wavesurfer.js'

import { portfolioDataCategorized } from './data/portfolioData';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PortfolioSection from './components/PortfolioSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import BottomPlayer from './components/BottomPlayer';
import Preloader from './components/Preloader';


function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isFading, setIsFading] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);

    const [playerState, setPlayerState] = useState({
        isPlaying: false,
        currentTrack: null,
        activePlaylistId: null,
        activePlaylist: null,
        currentTrackIndex: 0,
        currentTime: 0,
        duration: 0,
        volume: 1,
        isMuted: false,
        volumeBeforeMute: 1,
    });
    
    // 2. สร้าง Ref สำหรับ WaveSurfer สองตัว
    const wavesurferRef = useRef(null); // Ref สำหรับเก็บ instance ของ WaveSurfer
    const waveformContainerRef = useRef(null); // Ref สำหรับ div ที่จะให้ WaveSurfer วาดคลื่นเสียง

    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
                setIsLoading(false);
                setContentVisible(true);
            }, 500); 
        }, 1000); 

        return () => clearTimeout(timer);
    }, []);

    // 3. สร้างฟังก์ชันควบคุมหลัก
    const handlePlayPause = useCallback(() => {
        if (wavesurferRef.current) {
            wavesurferRef.current.playPause();
        }
    }, []);

    const handleNext = useCallback(() => {
        if (!playerState.activePlaylist) return;
        const newIndex = (playerState.currentTrackIndex + 1) % playerState.activePlaylist.tracks.length;
        setPlayerState(prev => ({
            ...prev,
            currentTrackIndex: newIndex,
            currentTrack: prev.activePlaylist.tracks[newIndex],
        }));
    }, [playerState.currentTrackIndex, playerState.activePlaylist]);

    const handlePrev = useCallback(() => {
        if (!playerState.activePlaylist) return;
        const newIndex = (playerState.currentTrackIndex - 1 + playerState.activePlaylist.tracks.length) % playerState.activePlaylist.tracks.length;
        setPlayerState(prev => ({
            ...prev,
            currentTrackIndex: newIndex,
            currentTrack: prev.activePlaylist.tracks[newIndex],
        }));
    }, [playerState.currentTrackIndex, playerState.activePlaylist]);
    
    const handleTrackSelect = useCallback((item, trackIndex) => {
         const isSameTrack = playerState.currentTrack && playerState.currentTrack.src === item.tracks[trackIndex].src;
         if (isSameTrack) {
            handlePlayPause();
         } else {
            setPlayerState(prev => ({
                ...prev,
                activePlaylist: item,
                activePlaylistId: item.id,
                currentTrackIndex: trackIndex,
                currentTrack: item.tracks[trackIndex],
            }));
         }
    }, [playerState.currentTrack, handlePlayPause]);
    
    const handleVolumeChange = useCallback((e) => {
        const newVolume = parseFloat(e.target.value);
        if (wavesurferRef.current) {
            wavesurferRef.current.setVolume(newVolume);
        }
        setPlayerState(prev => ({
            ...prev,
            volume: newVolume,
            isMuted: newVolume === 0,
        }));
    }, []);

    const toggleMute = useCallback(() => {
        setPlayerState(prev => {
            const isCurrentlyMuted = prev.volume === 0;
            let newVolume;
            if (isCurrentlyMuted) {
                newVolume = prev.volumeBeforeMute;
                return { ...prev, volume: newVolume, isMuted: false };
            } else {
                newVolume = 0;
                return { ...prev, volumeBeforeMute: prev.volume, volume: newVolume, isMuted: true };
            }
        });
    }, []);

    // 4. useEffect หลักสำหรับสร้างและจัดการ WaveSurfer
    useEffect(() => {
        if (!waveformContainerRef.current) return;

        
        // สร้าง instance ของ WaveSurfer
        const ws = WaveSurfer.create({
            container: waveformContainerRef.current,

            waveColor: '#4d4d4d',
            progressColor: '#c6b185',
            height: 40,
            normalize: true,
            cursorWidth: 0,
            width : null,
            barWidth: 2,
            barRadius: 2,
            dragToSeek: true,
            responsive: true,
            hideScrollbar: true,
        });

        wavesurferRef.current = ws;

        // --- ตั้งค่า Event Listeners ---
        const onReady = () => {
            setPlayerState(prev => ({ ...prev, duration: ws.getDuration() }));
            ws.play();
        };
        const onPlay = () => setPlayerState(prev => ({ ...prev, isPlaying: true }));
        const onPause = () => setPlayerState(prev => ({ ...prev, isPlaying: false }));
        const onTimeUpdate = (currentTime) => setPlayerState(prev => ({ ...prev, currentTime }));
        const onFinish = () => handleNext();
        // 'interaction' คือการที่ผู้ใช้คลิกบนคลื่นเสียงเพื่อ seek
        const onInteraction = (newTime) => ws.setTime(newTime);

        ws.on('ready', onReady);
        ws.on('play', onPlay);
        ws.on('pause', onPause);
        ws.on('timeupdate', onTimeUpdate);
        ws.on('finish', onFinish);
        ws.on('interaction', onInteraction);

        // Cleanup function
        return () => {
            ws.destroy();
        }
    }, [handleNext]);

    // 5. useEffect สำหรับโหลดเพลงใหม่เมื่อ currentTrack เปลี่ยน
    useEffect(() => {
        if (wavesurferRef.current && playerState.currentTrack) {
            wavesurferRef.current.load(playerState.currentTrack.src);
        }
    }, [playerState.currentTrack]);
    
    // 6. useEffect สำหรับปรับระดับเสียง
    useEffect(() => {
        if(wavesurferRef.current) {
            wavesurferRef.current.setVolume(playerState.volume);
        }
    }, [playerState.volume]);


    return (
        <React.Fragment>
            {isLoading && <Preloader isFading={isFading} />}
            <div className={`app-content ${contentVisible ? 'visible' : ''}`}>
                {/* 7. ลบแท็ก <audio> ออกจากตรงนี้ */}
                <Header />
                <main>
                    <HeroSection />
                    <PortfolioSection 
                        playerState={playerState} 
                        onTrackSelect={handleTrackSelect}
                        portfolioData={portfolioDataCategorized} 
                    />
                    <AboutSection />
                </main>
                <ContactSection />
                <BottomPlayer 
                    playerState={playerState}
                    onPlayPause={handlePlayPause}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onVolumeChange={handleVolumeChange}
                    onToggleMute={toggleMute}
                    waveformContainerRef={waveformContainerRef} // 8. ส่ง ref ไปให้ BottomPlayer
                />
            </div>
        </React.Fragment>
    );
}

export default App;

