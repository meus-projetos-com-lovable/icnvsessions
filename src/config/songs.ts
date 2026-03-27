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

// Auto-detect all audio files in /public/musicas/
// Structure: /public/musicas/{Song Name}/{Channel Name}/audio.mp3
const audioFiles = import.meta.glob('/public/musicas/**/*.(mp3|wav|ogg|flac|m4a|aac)', { eager: false });

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function detectType(channelName: string): ChannelConfig['type'] {
  const lower = channelName.toLowerCase();
  if (/voz|vocal|voc|lead|canto|coro|backing/i.test(lower)) return 'vocal';
  if (/piano|keys|teclado|synth|pad|organ|órgão/i.test(lower)) return 'keys';
  if (/guitar|guitarra|violão|acoustic/i.test(lower)) return 'guitar';
  if (/drum|bateria|percuss|click/i.test(lower)) return 'drums';
  if (/bass|baixo|contra/i.test(lower)) return 'bass';
  return 'other';
}

function discoverSongs(): SongConfig[] {
  const songMap = new Map<string, ChannelConfig[]>();

  for (const filePath of Object.keys(audioFiles)) {
    // filePath looks like: /public/musicas/Song Name/Channel Name/audio.mp3
    const relative = filePath.replace('/public/musicas/', '');
    const parts = relative.split('/');

    if (parts.length < 2) continue;

    const songName = parts[0];
    // Use the audio filename (without extension) as the channel name
    const fileName = parts[parts.length - 1];
    const channelName = fileName.replace(/\.(mp3|wav|ogg|flac|m4a|aac)$/i, '');
    const publicPath = filePath.replace('/public', '');

    if (!songMap.has(songName)) {
      songMap.set(songName, []);
    }

    songMap.get(songName)!.push({
      name: channelName,
      path: publicPath,
      type: detectType(channelName),
    });
  }

  return Array.from(songMap.entries())
    .map(([name, channels]) => ({
      name,
      slug: slugify(name),
      channels: channels.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const songs: SongConfig[] = discoverSongs();

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
