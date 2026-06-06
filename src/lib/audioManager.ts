/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SoundType } from '../types';

class AudioManager {
  private ctx: AudioContext | null = null;
  private nodes: Map<string, {
    sourceNode: AudioNode | null;
    gainNode: GainNode;
    isPlaying: boolean;
    updateFn?: (t: number) => void;
  }> = new Map();

  private intervalId: number | null = null;
  private time = 0;

  constructor() {
    // Lazy initialize to bypass auto-play restrictions
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getContextState(): string {
    return this.ctx ? this.ctx.state : 'uninitialized';
  }

  // Generate buffer for rain (binaural-like brown noise with rapid random gains)
  private createBrownNoiseBuffer(seconds = 2): AudioBuffer {
    const sampleRate = this.ctx!.sampleRate;
    const bufferSize = sampleRate * seconds;
    const buffer = this.ctx!.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise equation
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      // Normalize a bit to prevent clipping
      data[i] *= 3.5;
    }
    return buffer;
  }

  // Generate buffer for white noise (for wind, etc.)
  private createWhiteNoiseBuffer(seconds = 2): AudioBuffer {
    const sampleRate = this.ctx!.sampleRate;
    const bufferSize = sampleRate * seconds;
    const buffer = this.ctx!.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Create or retrieve channel info
  private getOrCreateChannel(trackId: string): GainNode {
    this.initContext();
    const existing = this.nodes.get(trackId);
    if (existing) {
      return existing.gainNode;
    }

    const gainNode = this.ctx!.createGain();
    gainNode.gain.value = 0;
    gainNode.connect(this.ctx!.destination);

    this.nodes.set(trackId, {
      sourceNode: null,
      gainNode,
      isPlaying: false
    });

    return gainNode;
  }

  public setVolume(trackId: string, volumePercent: number) {
    this.initContext();
    const gainNode = this.getOrCreateChannel(trackId);
    const targetGain = Math.max(0, Math.min(1.2, volumePercent / 100));
    
    if (this.ctx) {
      // Smooth transition
      gainNode.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    } else {
      gainNode.gain.value = targetGain;
    }
  }

  public startTrack(trackId: string, soundType: SoundType) {
    this.initContext();
    if (!this.ctx) return;

    this.stopTrack(trackId);
    const gainNode = this.getOrCreateChannel(trackId);
    let sourceNode: AudioNode | null = null;
    let updateFn: ((t: number) => void) | undefined;

    switch (soundType) {
      case 'rain': {
        // High quality brown noise + low pass filter custom rain sweep
        const bufferNode = this.ctx.createBufferSource();
        bufferNode.buffer = this.createBrownNoiseBuffer(4);
        bufferNode.loop = true;

        const lpFilter = this.ctx.createBiquadFilter();
        lpFilter.type = 'lowpass';
        lpFilter.frequency.value = 400;

        // Modulate filter for rain waves
        updateFn = (t) => {
          if (this.ctx) {
            const freq = 450 + Math.sin(t * 0.4) * 80 + Math.cos(t * 1.5) * 20;
            lpFilter.frequency.setValueAtTime(freq, this.ctx.currentTime);
          }
        };

        bufferNode.connect(lpFilter);
        lpFilter.connect(gainNode);
        bufferNode.start(0);
        sourceNode = bufferNode;
        break;
      }

      case 'heartbeat': {
        // Double-synth oscillator pulse loop generator triggered at 1.1s cycles (approx 55 BPM)
        let lastBeat = 0;
        updateFn = (t) => {
          if (!this.ctx) return;
          const cycle = 1.1; // seconds
          const localTime = this.ctx.currentTime;
          if (localTime - lastBeat > cycle) {
            lastBeat = localTime;
            
            // First Beat (Lubb)
            this.triggerHeartPulse(localTime, 55, 0.15, 0.9);
            // Second Beat (Dubb)
            this.triggerHeartPulse(localTime + 0.28, 48, 0.12, 0.6);
          }
        };
        // Needs a dummy node so updateFn keeps ticking
        const dummyOsc = this.ctx.createOscillator();
        dummyOsc.frequency.value = 0;
        dummyOsc.connect(gainNode);
        dummyOsc.start(0);
        sourceNode = dummyOsc;
        break;
      }

      case 'whisper': {
        // Narrow band white noise sweep
        const bufferNode = this.ctx.createBufferSource();
        bufferNode.buffer = this.createWhiteNoiseBuffer(3);
        bufferNode.loop = true;

        const bandpass = this.ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.Q.value = 12.0; // tight band for atmospheric whispering whistle
        bandpass.frequency.value = 800;

        const lowpass = this.ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 1600;

        updateFn = (t) => {
          if (this.ctx) {
            const bpFreq = 700 + Math.sin(t * 0.2) * 250 + Math.sin(t * 0.8) * 80;
            bandpass.frequency.setValueAtTime(bpFreq, this.ctx.currentTime);
          }
        };

        bufferNode.connect(bandpass);
        bandpass.connect(lowpass);
        lowpass.connect(gainNode);
        bufferNode.start(0);
        sourceNode = bufferNode;
        break;
      }

      case 'crackle': {
        // Fire crackle: randomly timed crackles
        let lastCrackle = 0;
        updateFn = (t) => {
          if (!this.ctx) return;
          const localTime = this.ctx.currentTime;
          // Random schedule
          if (localTime - lastCrackle > 0.08 + Math.random() * 0.4) {
            lastCrackle = localTime;
            this.triggerCrackleSpit(localTime);
          }
        };
        const dummyOsc = this.ctx.createOscillator();
        dummyOsc.frequency.value = 0;
        dummyOsc.connect(gainNode);
        dummyOsc.start(0);
        sourceNode = dummyOsc;
        break;
      }

      case 'breathing': {
        // Slow swell simulation: cycle volume gain
        updateFn = (t) => {
          if (this.ctx) {
            // Sine cycle from 0.1 to 1.0 over a 5.5 second breath period
            const swell = 0.5 + Math.sin(t * (Math.PI / 2.75)) * 0.4;
            // Also generate a soft ambient tone so they can hear the breathing cycle guideway
            const target = Math.max(0.05, swell);
            gainNode.gain.setValueAtTime(target * 0.7, this.ctx.currentTime);
          }
        };

        // Create an organic low sweeping wave
        const breathOsc = this.ctx.createOscillator();
        breathOsc.type = 'sine';
        breathOsc.frequency.value = 65; // ultra-low relaxing hum
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 120;

        breathOsc.connect(filter);
        filter.connect(gainNode);
        breathOsc.start(0);
        sourceNode = breathOsc;
        break;
      }

      case 'breeze': {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 110; 
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 200;

        osc.connect(filter);
        filter.connect(gainNode);
        osc.start(0);
        sourceNode = osc;
        break;
      }
    }

    const record = this.nodes.get(trackId);
    if (record) {
      record.sourceNode = sourceNode;
      record.isPlaying = true;
      record.updateFn = updateFn;
    }

    // Start global tick if not running
    this.startGlobalTick();
  }

  private triggerHeartThumpBase(time: number, freq: number, duration: number, intensity: number) {
    if (!this.ctx) return;
    const gainNode = this.nodes.get('detak-jantung')?.gainNode;
    if (!gainNode || gainNode.gain.value <= 0.01) return;

    const osc = this.ctx.createOscillator();
    const thumpGain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    // rapid pitch slide downwards like a real thump
    osc.frequency.exponentialRampToValueAtTime(10, time + duration);

    thumpGain.gain.setValueAtTime(0.01, time);
    thumpGain.gain.linearRampToValueAtTime(intensity * 0.8, time + 0.02);
    thumpGain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(75, time);

    osc.connect(thumpGain);
    thumpGain.connect(lowpass);
    // Connect to the master channel of this track
    lowpass.connect(gainNode);

    osc.start(time);
    osc.stop(time + duration);
  }

  private triggerHeartPulse(time: number, freq: number, duration: number, intensity: number) {
    this.triggerHeartThumpBase(time, freq, duration, intensity);
  }

  private triggerCrackleSpit(time: number) {
    if (!this.ctx) return;
    const gainNode = this.nodes.get('lilas-perapian')?.gainNode;
    if (!gainNode || gainNode.gain.value <= 0.01) return;

    const crackleGain = this.ctx.createGain();
    const source = this.ctx.createBufferSource();
    source.buffer = this.createWhiteNoiseBuffer(0.05);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 15.0;
    filter.frequency.setValueAtTime(2500 + Math.random() * 4000, time);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(1200, time);

    crackleGain.gain.setValueAtTime(0.001, time);
    crackleGain.gain.linearRampToValueAtTime(0.12 * Math.random(), time + 0.002);
    crackleGain.gain.exponentialRampToValueAtTime(0.001, time + 0.01 + Math.random() * 0.03);

    source.connect(filter);
    filter.connect(highpass);
    highpass.connect(crackleGain);
    crackleGain.connect(gainNode);

    source.start(time);
    source.stop(time + 0.05);
  }

  public stopTrack(trackId: string) {
    const record = this.nodes.get(trackId);
    if (record && record.isPlaying) {
      if (record.sourceNode) {
        try {
          (record.sourceNode as any).stop();
        } catch (e) {
          // ignore already stopped state
        }
        record.sourceNode.disconnect();
        record.sourceNode = null;
      }
      record.isPlaying = false;
      record.updateFn = undefined;
    }

    // Stop ticks if all are quiet
    let active = false;
    this.nodes.forEach((r) => { if (r.isPlaying) active = true; });
    if (!active) {
      this.stopGlobalTick();
    }
  }

  private startGlobalTick() {
    if (this.intervalId === null) {
      const fps = 40;
      const intervalMs = 1000 / fps;
      this.intervalId = window.setInterval(() => {
        this.time += intervalMs / 1000;
        this.nodes.forEach((record) => {
          if (record.isPlaying && record.updateFn) {
            record.updateFn(this.time);
          }
        });
      }, intervalMs);
    }
  }

  private stopGlobalTick() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public stopAll() {
    this.nodes.forEach((_, trackId) => {
      this.stopTrack(trackId);
    });
    this.stopGlobalTick();
  }

  public isTrackPlaying(trackId: string): boolean {
    const record = this.nodes.get(trackId);
    return record ? record.isPlaying : false;
  }
}

export const audioManager = new AudioManager();
