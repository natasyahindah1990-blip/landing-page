/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Headphones, Play, Pause, Volume2, Sparkles, AlertCircle, RefreshCw, Milestone, Wind, Flame, Heart, CloudRain, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AsmrTrack } from '../types';
import { ASMR_TRACKS } from '../data/portalData';
import { audioManager } from '../lib/audioManager';

export default function AsmrHub() {
  const [tracks, setTracks] = useState<AsmrTrack[]>(ASMR_TRACKS);
  
  // Track specific playing state
  const [playingStates, setPlayingStates] = useState<{ [key: string]: boolean }>({});
  const [vols, setVols] = useState<{ [key: string]: number }>({});
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);

  // Breath guide states
  const [breathPhase, setBreathPhase] = useState<'tarik' | 'tahan1' | 'hembus' | 'tahan2'>('tarik');
  const [breathTimer, setBreathTimer] = useState<number>(4);
  const breathTotalCycleRef = useRef<number>(4); // 4 seconds per phase

  // Canvas context refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string; alpha: number; speed: number }>>([]);

  // Initialization and local load
  useEffect(() => {
    // Set initial volumes
    const initialVols: { [key: string]: number } = {};
    const initialPlaying: { [key: string]: boolean } = {};
    tracks.forEach((track) => {
      initialVols[track.id] = track.defaultVolume;
      initialPlaying[track.id] = false;
    });
    setVols(initialVols);
    setPlayingStates(initialPlaying);

    return () => {
      // Safety mute when leaving hub
      audioManager.stopAll();
    };
  }, []);

  // Handle Play/Pause for individual sound track
  const toggleTrack = (trackId: string, soundType: any) => {
    const isNowPlaying = !playingStates[trackId];
    
    setPlayingStates(prev => ({ ...prev, [trackId]: isNowPlaying }));

    if (isNowPlaying) {
      audioManager.startTrack(trackId, soundType);
      audioManager.setVolume(trackId, vols[trackId] || 40);
    } else {
      audioManager.stopTrack(trackId);
    }

    // sync Master button state
    setTimeout(() => {
      let anyPlaying = false;
      tracks.forEach((t) => {
        if (audioManager.isTrackPlaying(t.id)) anyPlaying = true;
      });
      setIsPlayingAll(anyPlaying);
    }, 100);
  };

  // Adjust sound track volume slider
  const handleVolChange = (trackId: string, volume: number) => {
    setVols(prev => ({ ...prev, [trackId]: volume }));
    audioManager.setVolume(trackId, volume);

    // If slider is adjusted when unplayed, auto trigger play!
    if (volume > 0 && !playingStates[trackId]) {
      const track = tracks.find((t) => t.id === trackId);
      if (track) {
        toggleTrack(trackId, track.soundType);
      }
    }
  };

  // Play or Pause everything
  const toggleAll = () => {
    const nextState = !isPlayingAll;
    setIsPlayingAll(nextState);

    const nextPlaying: { [key: string]: boolean } = {};
    tracks.forEach((track) => {
      nextPlaying[track.id] = nextState;
      if (nextState) {
        audioManager.startTrack(track.id, track.soundType);
        audioManager.setVolume(track.id, vols[track.id] || 40);
      } else {
        audioManager.stopTrack(track.id);
      }
    });
    setPlayingStates(nextPlaying);
  };

  // Coordinated breathing cycle trigger
  useEffect(() => {
    const interval = window.setInterval(() => {
      setBreathTimer((prev) => {
        if (prev <= 1) {
          // Switch phase
          setBreathPhase((currentPhase) => {
            if (currentPhase === 'tarik') return 'tahan1';
            if (currentPhase === 'tahan1') return 'hembus';
            if (currentPhase === 'hembus') return 'tahan2';
            return 'tarik';
          });
          return 4; // reset 4s timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  // Canvas visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fluid resize observer setup
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (canvas) {
          canvas.width = entry.contentRect.width;
          canvas.height = entry.contentRect.height;
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Seed initial particles
    const maxParticles = 60;
    particlesRef.current = [];
    for (let i = 0; i < maxParticles; i++) {
      particlesRef.current.push({
        x: Math.random() * (canvas.width || 400),
        y: Math.random() * (canvas.height || 300),
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.5 - Math.random() * 1.2,
        radius: 1 + Math.random() * 4,
        color: ['#ec4899', '#f43f5e', '#a855f7', '#fb7185'][Math.floor(Math.random() * 4)],
        alpha: 0.1 + Math.random() * 0.6,
        speed: 1 + Math.random()
      });
    }

    // Anim frame
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Extract current active volume weights to scale dynamic visual speeds
      let activeVolumeWeight = 0.5;
      let playingCount = 0;
      tracks.forEach((t) => {
        if (playingStates[t.id]) {
          activeVolumeWeight += (vols[t.id] || 40) / 100;
          playingCount++;
        }
      });
      if (playingCount > 0) activeVolumeWeight /= playingCount;

      // Update and draw particles
      particlesRef.current.forEach((p) => {
        p.y += p.vy * (1 + activeVolumeWeight * 1.5);
        p.x += p.vx + Math.sin(p.y * 0.01) * 0.15;
        p.alpha -= 0.0015;

        if (p.y < -10 || p.alpha <= 0) {
          p.y = (canvas.height || 300) + 10;
          p.x = Math.random() * (canvas.width || 400);
          p.alpha = 0.3 + Math.random() * 0.7;
        }

        // Draw particle glow
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        // Reactive pulse size
        const pSize = p.radius * (1 + activeVolumeWeight * 0.8);
        ctx.beginPath();
        ctx.arc(p.x, p.y, pSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [playingStates, vols]);

  // Track Icon renderer helper
  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain':
        return <CloudRain className="w-5 h-5 text-sky-400" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-teal-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-500" />;
      default:
        return <Star className="w-5 h-5 text-pink-400" />;
    }
  };

  return (
    <div id="section-asmr-hub" className="w-full max-w-6xl mx-auto px-4 py-8">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300 font-sans tracking-wide">
            CERITA VIRAL ASMR
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Padukan simfoni ambient sintetis sesuai hasrat relaksasi Anda. Hubungkan headphone untuk hasil optimal.
          </p>
        </div>

        <div>
          <button
            id="btn-toggle-all-asmr"
            onClick={toggleAll}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 border cursor-pointer active:scale-95 ${
              isPlayingAll
                ? 'bg-neutral-900 border-rose-500/50 text-rose-400 shadow-lg shadow-pink-500/5'
                : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white border-pink-500/20 shadow-md shadow-pink-500/10'
            }`}
          >
            {isPlayingAll ? (
              <>
                <Pause className="w-4 h-4 fill-rose-400/20" />
                <span>Hentikan Semua Suara</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white/20" />
                <span>Mainkan Semua Suara</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MIXER CONSOLE COLUMNS (Left/Center) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs uppercase font-mono text-neutral-400 tracking-widest flex items-center gap-1.5 mb-2">
            <Volume2 className="w-4 h-4 text-pink-500" />
            <span>Mesa Pencampur Suara (Soundboard Mixer)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tracks.map((track) => {
              const isPlaying = playingStates[track.id] || false;
              const currentVol = vols[track.id] !== undefined ? vols[track.id] : track.defaultVolume;

              return (
                <div
                  key={track.id}
                  className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden bg-neutral-950/60 ${
                    isPlaying
                      ? 'border-pink-500/60 shadow-[0_0_15px_rgba(236,72,153,0.06)]'
                      : 'border-neutral-800'
                  }`}
                >
                  {/* Highlight bar inside card */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
                      isPlaying ? 'bg-gradient-to-b from-pink-500 to-rose-500' : 'bg-transparent'
                    }`}
                  />

                  <div className="flex items-start gap-4 mb-4">
                    {/* Circle icon */}
                    <div className={`p-3 rounded-xl border transition-all duration-300 ${
                      isPlaying
                        ? 'bg-pink-500/10 border-pink-500/30'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                    }`}>
                      {getTrackIcon(track.iconName)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-neutral-200">
                          {track.name}
                        </h4>
                        {isPlaying && (
                          <span className="flex h-1.5 w-1.5 rounded-full bg-pink-500 animate-ping" />
                        )}
                      </div>
                      <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2">
                        {track.description}
                      </p>
                    </div>
                  </div>

                  {/* Volume Slider & Toggle button */}
                  <div className="flex items-center gap-3.5 mt-2">
                    <button
                      id={`btn-toggle-track-${track.id}`}
                      onClick={() => toggleTrack(track.id, track.soundType)}
                      className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                      title={isPlaying ? 'Hentikan' : 'Mainkan'}
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1 flex items-center gap-2 bg-neutral-900/40 p-2 rounded-lg border border-neutral-800/40">
                      <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-pink-400' : 'text-neutral-600'}`} />
                      <input
                        id={`volume-slider-${track.id}`}
                        type="range"
                        min="0"
                        max="100"
                        value={currentVol}
                        onChange={(e) => handleVolChange(track.id, Number(e.target.value))}
                        className="w-full accent-pink-500 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                        title={`Atur Volume ${track.name}`}
                      />
                      <span className="text-[10px] font-mono text-neutral-500 w-6 text-right">
                        {currentVol}%
                      </span>
                    </div>
                  </div>

                  {/* Tiny animated soundwave inside playing tracks */}
                  {isPlaying && (
                    <div className="absolute right-4 top-4 flex items-end gap-0.5 h-4">
                      <span className="w-0.5 bg-pink-500/40 animate-[bounce_0.8s_infinite]" style={{ height: '30%', animationDelay: '0.1s' }} />
                      <span className="w-0.5 bg-pink-500/60 animate-[bounce_0.8s_infinite]" style={{ height: '70%', animationDelay: '0.4s' }} />
                      <span className="w-0.5 bg-pink-500/50 animate-[bounce_0.8s_infinite]" style={{ height: '50%', animationDelay: '0.2s' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950/20 p-4 text-xs text-neutral-500 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-pink-500/60 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Catatan: Suatu <strong className="text-pink-400 font-medium">Binaural Beat</strong> atau ASMR terbaik dihasilkan melalui paduan suara rintik gerimis bervolume rendah (35%) dan detak jantung intim bervolume sedang (55%). Sangat disarankan mematikan distraksi cahaya sekeliling Anda.
            </p>
          </div>
        </div>

        {/* COMPANION VISUALIZER AND BREATING GUIDE (Right Column) */}
        <div className="space-y-6">
          <h3 className="text-xs uppercase font-mono text-neutral-400 tracking-widest flex items-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span>Kubah Visual & Panduan Napas</span>
          </h3>

          {/* Particle Canvas Box */}
          <div
            ref={containerRef}
            className="relative h-48 rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden flex items-center justify-center group"
          >
            {/* Live Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

            <div className="relative text-center p-4 z-10 pointers-event-none pointer-events-none">
              <span className="text-[10px] tracking-[0.25em] font-mono text-pink-400/80 uppercase font-bold pr-1">
                Visualizer Ambien
              </span>
              <p className="text-neutral-500 text-[11px] mt-1 max-w-xs mx-auto">
                Pulsasi partikel menari secara intuitif mengikuti paduan intensitas audio dan volume mixer Anda.
              </p>
            </div>
          </div>

          {/* Sensual Breathing Helper Circle */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-500/5 p-6 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <h4 className="text-sm font-bold text-neutral-300 font-sans tracking-wide mb-1">
              Panduan Napas Sensual
            </h4>
            <span className="text-[9px] font-mono uppercase text-neutral-500 mb-6">
              Menenangkan Sistem Saraf & Merilekskan Tubuh
            </span>

            {/* Pulsating Ring Area */}
            <div className="relative h-36 w-36 flex items-center justify-center mb-6">
              {/* Pulsating glow backdrops */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={breathPhase}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale:
                      breathPhase === 'tarik'
                        ? 1.4
                        : breathPhase === 'tahan1'
                        ? 1.4
                        : breathPhase === 'hembus'
                        ? 0.95
                        : 0.95,
                    opacity: 0.25,
                  }}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                  className={`absolute inset-0 rounded-full blur-xl pointers-event-none ${
                    breathPhase === 'tarik'
                      ? 'bg-pink-500'
                      : breathPhase === 'tahan1'
                      ? 'bg-amber-500'
                      : breathPhase === 'hembus'
                      ? 'bg-purple-500'
                      : 'bg-indigo-500'
                  }`}
                />
              </AnimatePresence>

              {/* Main Visual circle */}
              <motion.div
                animate={{
                  scale:
                    breathPhase === 'tarik'
                      ? 1.25
                      : breathPhase === 'tahan1'
                      ? 1.25
                      : breathPhase === 'hembus'
                      ? 0.9
                      : 0.9,
                }}
                transition={{ duration: 4, ease: 'easeInOut' }}
                className={`h-24 w-24 rounded-full border-2 flex flex-col items-center justify-center transition-colors duration-1000 ${
                  breathPhase === 'tarik'
                    ? 'border-pink-500 bg-pink-500/5 text-pink-400'
                    : breathPhase === 'tahan1'
                    ? 'border-amber-500 bg-amber-500/5 text-amber-400'
                    : breathPhase === 'hembus'
                    ? 'border-purple-500 bg-purple-500/5 text-purple-400'
                    : 'border-indigo-500 bg-indigo-500/5 text-indigo-400'
                }`}
              >
                <span className="text-[10px] font-mono tracking-widest font-extrabold uppercase">
                  {breathPhase === 'tarik' && 'Tarik'}
                  {breathPhase === 'tahan1' && 'Tahan'}
                  {breathPhase === 'hembus' && 'Hembus'}
                  {breathPhase === 'tahan2' && 'Rileks'}
                </span>
                <span className="text-xl font-bold mt-1">
                  {breathTimer}s
                </span>
              </motion.div>
            </div>

            {/* Instruction description helper */}
            <div className="h-10 flex items-center justify-center">
              <p className="text-xs text-neutral-400 max-w-xs leading-relaxed font-sans italic">
                {breathPhase === 'tarik' && 'Tarik napas dalam-dalam perlahan melalui hidung...'}
                {breathPhase === 'tahan1' && 'Rasakan aliran udara, letakkan ketenangan dalam dada...'}
                {breathPhase === 'hembus' && 'Hembuskan beban pikiran keluar perlahan lewat bibir...'}
                {breathPhase === 'tahan2' && 'Istirahatkan diri sejenak sebelum putaran berikutnya...'}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
