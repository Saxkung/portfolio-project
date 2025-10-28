import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import './App.css';
import WaveSurfer from 'wavesurfer.js'

import { portfolioDataCategorized } from './data/portfolioData';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
//import PortfolioSection from './components/PortfolioSection';
//import AboutSection from './components/AboutSection';
//import ContactSection from './components/ContactSection';
import BottomPlayer from './components/BottomPlayer';


const PortfolioSection = lazy(() => import('./components/PortfolioSection'));
const AboutSection = lazy(() => import('./components/AboutSection'));
const ContactSection = lazy(() => import('./components/ContactSection'));

 
function App() {

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
    
    const wavesurferRef = useRef(null); // Ref สำหรับเก็บ instance ของ WaveSurfer
    const waveformContainerRef = useRef(null); // Ref สำหรับ div ที่จะให้ WaveSurfer วาดคลื่นเสียง
    

    
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

    const handleClosePlayer = useCallback(() => {
        if (wavesurferRef.current) {
            wavesurferRef.current.stop();
        }
        // ล้างค่า Playlist ที่กำลังเล่นอยู่
        setPlayerState(prev => ({
            ...prev,
            isPlaying: false,
            currentTrack: null,
            activePlaylistId: null,
            activePlaylist: null,
            currentTime: 0,
            duration: 0,
        }));
    }, []);
    
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

    useEffect(() => {
        if (!waveformContainerRef.current) return;

        
        // สร้าง instance ของ WaveSurfer
        const ws = WaveSurfer.create({
            container: waveformContainerRef.current,

            waveColor: '#4d4d4d',
            progressColor: '#c6b185',
            height: 40,
            normalize: false,
            cursorWidth: 0,
            barWidth: 2,
            barGap: 2,
            barRadius: 2,
            dragToSeek: true,
            responsive: true,
            hideScrollbar: true,
        });

        wavesurferRef.current = ws;

        const onReady = () => {
            setPlayerState(prev => ({ ...prev, duration: ws.getDuration() }));
            ws.play();
        };
        const onPlay = () => setPlayerState(prev => ({ ...prev, isPlaying: true }));
        const onPause = () => setPlayerState(prev => ({ ...prev, isPlaying: false }));
        const onTimeUpdate = (currentTime) => setPlayerState(prev => ({ ...prev, currentTime }));
        const onFinish = () => handleNext();
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

    useEffect(() => {
        if (wavesurferRef.current && playerState.currentTrack) {
            wavesurferRef.current.load(playerState.currentTrack.src);
        }
    }, [playerState.currentTrack]);
    
    useEffect(() => {
        if(wavesurferRef.current) {
            wavesurferRef.current.setVolume(playerState.volume);
        }
    }, [playerState.volume]);


    return (
        <React.Fragment>       
            <div className={`app-content visible`}>
                <Header />
                <main>
                    <HeroSection />
                    <Suspense fallback={<div>Loading...</div>}>
                        <PortfolioSection 
                            playerState={playerState} 
                            onTrackSelect={handleTrackSelect}
                            portfolioData={portfolioDataCategorized} 
                        />
                        <AboutSection />
                    </Suspense>
                </main>
                <Suspense fallback={null}> 
                    <ContactSection />
                </Suspense>
                <BottomPlayer 
                    playerState={playerState}
                    onPlayPause={handlePlayPause}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onVolumeChange={handleVolumeChange}
                    onToggleMute={toggleMute}
                    waveformContainerRef={waveformContainerRef}
                    onClosePlayer={handleClosePlayer} // 8. ส่ง ref ไปให้ BottomPlayer
                />
            </div>
        </React.Fragment>
    );
}

export default App;

