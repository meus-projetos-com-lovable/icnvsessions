export interface ChannelConfig {
  name: string;
  path: string;
  type: 'vocal' | 'keys' | 'guitar' | 'drums' | 'bass' | 'other';
}

export interface SongConfig {
  name: string;
  slug: string;
  channels: ChannelConfig[];
}

// Configure your songs here. Each song maps to a folder in /public/musicas/
// To add a new song: create the folder structure and add an entry here.
export const songs: SongConfig[] = [
  {
    name: "Way Maker",
    slug: "way-maker",
    channels: [
      { name: "Vocals", path: "/musicas/Way Maker/Vocals/audio.mp3", type: "vocal" },
      { name: "Piano", path: "/musicas/Way Maker/Piano/audio.mp3", type: "keys" },
      { name: "Guitar", path: "/musicas/Way Maker/Guitar/audio.mp3", type: "guitar" },
      { name: "Drums", path: "/musicas/Way Maker/Drums/audio.mp3", type: "drums" },
      { name: "Bass", path: "/musicas/Way Maker/Bass/audio.mp3", type: "bass" },
    ],
  },
  {
    name: "Goodness of God",
    slug: "goodness-of-god",
    channels: [
      { name: "Vocals", path: "/musicas/Goodness of God/Vocals/audio.mp3", type: "vocal" },
      { name: "Keys", path: "/musicas/Goodness of God/Keys/audio.mp3", type: "keys" },
      { name: "Acoustic Guitar", path: "/musicas/Goodness of God/Acoustic Guitar/audio.mp3", type: "guitar" },
      { name: "Drums", path: "/musicas/Goodness of God/Drums/audio.mp3", type: "drums" },
    ],
  },
  {
    name: "Build My Life",
    slug: "build-my-life",
    channels: [
      { name: "Lead Vocal", path: "/musicas/Build My Life/Lead Vocal/audio.mp3", type: "vocal" },
      { name: "Synth Pad", path: "/musicas/Build My Life/Synth Pad/audio.mp3", type: "keys" },
      { name: "Electric Guitar", path: "/musicas/Build My Life/Electric Guitar/audio.mp3", type: "guitar" },
      { name: "Bass", path: "/musicas/Build My Life/Bass/audio.mp3", type: "bass" },
    ],
  },
];

export function getSongBySlug(slug: string): SongConfig | undefined {
  return songs.find((s) => s.slug === slug);
}

export function getTrackColor(type: ChannelConfig['type']): string {
  const colors: Record<string, string> = {
    vocal: 'bg-track-vocal',
    keys: 'bg-track-keys',
    guitar: 'bg-track-guitar',
    drums: 'bg-track-drums',
    bass: 'bg-track-bass',
    other: 'bg-muted',
  };
  return colors[type] || colors.other;
}

export function getTrackDotColor(type: ChannelConfig['type']): string {
  const colors: Record<string, string> = {
    vocal: 'bg-blue-400',
    keys: 'bg-amber-400',
    guitar: 'bg-emerald-400',
    drums: 'bg-pink-400',
    bass: 'bg-violet-400',
    other: 'bg-gray-400',
  };
  return colors[type] || colors.other;
}
