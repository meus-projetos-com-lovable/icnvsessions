import { useState, useRef, useCallback, useEffect } from 'react';
import type { ChannelConfig } from '@/config/songs';

export interface ChannelState {
  name: string;
  type: ChannelConfig['type'];
  volume: number;
  muted: boolean;
  soloed: boolean;
  loaded: boolean;
}

interface AudioNode {
  source: AudioBufferSourceNode | null;
  gainNode: GainNode;
  buffer: AudioBuffer | null;
}

export function useMultiTrackPlayer(channels: ChannelConfig[]) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [channelStates, setChannelStates] = useState<ChannelState[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<AudioNode[]>([]);
  const startTimeRef = useRef(0);
  const offsetRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const channelsKeyRef = useRef('');
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Load saved volumes from localStorage
  const getSavedVolumes = useCallback((channelNames: string[]) => {
    try {
      const saved = localStorage.getItem('mixer-volumes');
      if (saved) {
        const parsed = JSON.parse(saved);
        return channelNames.map(name => parsed[name] ?? 80);
      }
    } catch {}
    return channelNames.map(() => 80);
  }, []);

  // Save volumes
  const saveVolumes = useCallback((states: ChannelState[]) => {
    try {
      const obj: Record<string, number> = {};
      states.forEach(s => { obj[s.name] = s.volume; });
      localStorage.setItem('mixer-volumes', JSON.stringify(obj));
    } catch {}
  }, []);

  // Initialize audio context and load buffers
  useEffect(() => {
    const key = channels.map(c => c.path).join('|');
    if (key === channelsKeyRef.current) return;
    channelsKeyRef.current = key;

    // Cleanup previous
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    cancelAnimationFrame(animFrameRef.current);
    setIsPlaying(false);
    setCurrentTime(0);
    offsetRef.current = 0;

    if (channels.length === 0) {
      setIsLoading(false);
      return;
    }

    const ctx = new AudioContext();
    audioContextRef.current = ctx;

    const savedVolumes = getSavedVolumes(channels.map(c => c.name));

    const initialStates: ChannelState[] = channels.map((ch, i) => ({
      name: ch.name,
      type: ch.type,
      volume: savedVolumes[i],
      muted: false,
      soloed: false,
      loaded: false,
    }));
    setChannelStates(initialStates);
    setIsLoading(true);

    // Create a master analyser node
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    analyser.connect(ctx.destination);
    analyserRef.current = analyser;

    const nodes: AudioNode[] = channels.map(() => {
      const gainNode = ctx.createGain();
      gainNode.connect(analyser);
      return { source: null, gainNode, buffer: null };
    });
    audioNodesRef.current = nodes;

    // Load all audio buffers
    Promise.all(
      channels.map(async (ch, i) => {
        try {
          const res = await fetch(ch.path);
          const arrayBuffer = await res.arrayBuffer();
          const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
          nodes[i].buffer = audioBuffer;
          nodes[i].gainNode.gain.value = savedVolumes[i] / 100;
          setChannelStates(prev =>
            prev.map((s, idx) => idx === i ? { ...s, loaded: true } : s)
          );
          return audioBuffer.duration;
        } catch (e) {
          console.error(`Failed to load ${ch.path}:`, e);
          return 0;
        }
      })
    ).then(durations => {
      const maxDuration = Math.max(...durations.filter(d => d > 0));
      setDuration(maxDuration || 0);
      setIsLoading(false);
    });

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ctx.close();
    };
  }, [channels, getSavedVolumes]);

  // Update time display
  const updateTime = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx || !isPlaying) return;
    const elapsed = ctx.currentTime - startTimeRef.current + offsetRef.current;
    if (elapsed >= duration && duration > 0) {
      stop();
      setCurrentTime(0);
      offsetRef.current = 0;
      return;
    }
    setCurrentTime(elapsed);
    animFrameRef.current = requestAnimationFrame(updateTime);
  }, [isPlaying, duration]);

  useEffect(() => {
    if (isPlaying) {
      animFrameRef.current = requestAnimationFrame(updateTime);
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, updateTime]);

  // Apply volume/mute/solo
  const applyGains = useCallback((states: ChannelState[]) => {
    const hasSolo = states.some(s => s.soloed);
    states.forEach((s, i) => {
      const node = audioNodesRef.current[i];
      if (!node) return;
      let vol = s.volume / 100;
      if (s.muted) vol = 0;
      if (hasSolo && !s.soloed) vol = 0;
      node.gainNode.gain.setTargetAtTime(vol, audioContextRef.current?.currentTime ?? 0, 0.02);
    });
  }, []);

  const startPlayback = useCallback((offset: number) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Stop existing sources
    audioNodesRef.current.forEach(node => {
      if (node.source) {
        try { node.source.stop(); } catch {}
        node.source = null;
      }
    });

    // Create new sources
    audioNodesRef.current.forEach((node, i) => {
      if (!node.buffer) return;
      const source = ctx.createBufferSource();
      source.buffer = node.buffer;
      source.connect(node.gainNode);
      source.start(0, offset);
      node.source = source;
    });

    startTimeRef.current = ctx.currentTime;
    offsetRef.current = offset;
  }, []);

  const play = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    startPlayback(offsetRef.current);
    setIsPlaying(true);
    applyGains(channelStates);
  }, [startPlayback, applyGains, channelStates]);

  const pause = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    const elapsed = ctx.currentTime - startTimeRef.current + offsetRef.current;
    offsetRef.current = elapsed;
    audioNodesRef.current.forEach(node => {
      if (node.source) {
        try { node.source.stop(); } catch {}
        node.source = null;
      }
    });
    setIsPlaying(false);
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  const stop = useCallback(() => {
    audioNodesRef.current.forEach(node => {
      if (node.source) {
        try { node.source.stop(); } catch {}
        node.source = null;
      }
    });
    setIsPlaying(false);
    cancelAnimationFrame(animFrameRef.current);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    const clamped = Math.max(0, Math.min(time, duration));
    offsetRef.current = clamped;
    setCurrentTime(clamped);
    if (isPlaying) {
      startPlayback(clamped);
      applyGains(channelStates);
    }
  }, [duration, isPlaying, startPlayback, applyGains, channelStates]);

  const skipForward = useCallback(() => seek(currentTime + 10), [seek, currentTime]);
  const skipBackward = useCallback(() => seek(currentTime - 10), [seek, currentTime]);

  const setVolume = useCallback((index: number, volume: number) => {
    setChannelStates(prev => {
      const next = prev.map((s, i) => i === index ? { ...s, volume } : s);
      applyGains(next);
      saveVolumes(next);
      return next;
    });
  }, [applyGains, saveVolumes]);

  const toggleMute = useCallback((index: number) => {
    setChannelStates(prev => {
      const next = prev.map((s, i) => i === index ? { ...s, muted: !s.muted } : s);
      applyGains(next);
      return next;
    });
  }, [applyGains]);

  const toggleSolo = useCallback((index: number) => {
    setChannelStates(prev => {
      const next = prev.map((s, i) => i === index ? { ...s, soloed: !s.soloed } : s);
      applyGains(next);
      return next;
    });
  }, [applyGains]);

  return {
    isPlaying,
    isLoading,
    currentTime,
    duration,
    channelStates,
    analyser: analyserRef.current,
    togglePlayPause,
    seek,
    skipForward,
    skipBackward,
    setVolume,
    toggleMute,
    toggleSolo,
  };
}
