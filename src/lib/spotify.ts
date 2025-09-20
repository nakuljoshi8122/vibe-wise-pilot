// Spotify Web API integration using Replit's managed connection
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  album: {
    images: { url: string; height: number; width: number }[];
    name: string;
  };
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: { url: string }[];
  product: 'free' | 'premium';
}

interface MoodConfig {
  valence: number;
  energy: number;
  genres: string[];
  danceability?: number;
  acousticness?: number;
  instrumentalness?: number;
}

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=spotify',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);
  
  const refreshToken = connectionSettings?.settings?.oauth?.credentials?.refresh_token;
  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
  const clientId = connectionSettings?.settings?.oauth?.credentials?.client_id;
  const expiresIn = connectionSettings.settings?.oauth?.credentials?.expires_in;
  
  if (!connectionSettings || (!accessToken || !clientId || !refreshToken)) {
    throw new Error('Spotify not connected');
  }
  
  return {accessToken, clientId, refreshToken, expiresIn};
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableSpotifyClient() {
  const {accessToken, clientId, refreshToken, expiresIn} = await getAccessToken();

  const spotify = SpotifyApi.withAccessToken(clientId, {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: expiresIn || 3600,
    refresh_token: refreshToken,
  });

  return spotify;
}

export class SpotifyService {
  private client: any = null;

  async getClient() {
    try {
      this.client = await getUncachableSpotifyClient();
      return this.client;
    } catch (error) {
      console.error('Failed to get Spotify client:', error);
      throw error;
    }
  }

  async handleAuthCallback(): Promise<boolean> {
    // Not needed with Replit integration - authentication is handled automatically
    return true;
  }

  isAuthenticated(): boolean {
    // Check if we can get a valid client
    try {
      return connectionSettings?.settings?.access_token != null;
    } catch {
      return false;
    }
  }

  logout() {
    // Logout is handled by Replit integration
    this.client = null;
    connectionSettings = null;
  }

  generateAuthUrl(): string {
    // Not needed with Replit integration
    return '';
  }

  async getUserProfile(): Promise<SpotifyUser> {
    const client = await this.getClient();
    const profile = await client.currentUser.profile();
    return {
      id: profile.id,
      display_name: profile.display_name || '',
      email: profile.email || '',
      images: profile.images || [],
      product: profile.product === 'premium' ? 'premium' : 'free'
    };
  }

  async getUserLikedSongs(limit: number = 20): Promise<SpotifyTrack[]> {
    const client = await this.getClient();
    const response = await client.currentUser.tracks.savedTracks(limit);
    return response.items.map((item: any) => item.track);
  }

  async getRecommendations(mood: string, limit: number = 20): Promise<SpotifyTrack[]> {
    const client = await this.getClient();
    
    // Map moods to Spotify audio features and genres
    const moodConfig: Record<string, MoodConfig> = {
      'Great': { 
        valence: 0.8, 
        energy: 0.7, 
        danceability: 0.6,
        genres: ['pop', 'dance', 'happy']
      },
      'Calm': { 
        valence: 0.5, 
        energy: 0.3, 
        acousticness: 0.7,
        genres: ['ambient', 'chill', 'acoustic']
      },
      'Stressed': { 
        valence: 0.3, 
        energy: 0.2, 
        acousticness: 0.8,
        genres: ['ambient', 'classical', 'meditation']
      },
      'Tired': { 
        valence: 0.6, 
        energy: 0.4, 
        instrumentalness: 0.3,
        genres: ['chill', 'lo-fi', 'ambient']
      },
      'Focused': { 
        valence: 0.5, 
        energy: 0.5, 
        instrumentalness: 0.6,
        genres: ['instrumental', 'classical', 'ambient']
      },
      'Confused': {
        valence: 0.4,
        energy: 0.3,
        acousticness: 0.6,
        genres: ['indie', 'alternative', 'folk']
      },
      'Frustrated': {
        valence: 0.3,
        energy: 0.6,
        danceability: 0.4,
        genres: ['rock', 'alternative', 'indie']
      }
    };

    const config = moodConfig[mood] || moodConfig['Calm'];
    const selectedGenres = config.genres.slice(0, 3); // Max 3 seed genres
    
    const params = {
      limit: limit,
      seed_genres: selectedGenres,
      target_valence: config.valence,
      target_energy: config.energy,
    } as any;

    if (config.danceability) {
      params.target_danceability = config.danceability;
    }
    if (config.acousticness) {
      params.target_acousticness = config.acousticness;
    }
    if (config.instrumentalness) {
      params.target_instrumentalness = config.instrumentalness;
    }

    const response = await client.recommendations.get(params);
    return response.tracks;
  }

  // Initialize Spotify Web Playback SDK
  async initializeWebPlayback(onReady: (deviceId: string) => void): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!(window as any).Spotify) {
        // Load Spotify Web Playback SDK
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);

        (window as any).onSpotifyWebPlaybackSDKReady = () => {
          this.createPlayer(onReady).then(resolve).catch(reject);
        };
      } else {
        this.createPlayer(onReady).then(resolve).catch(reject);
      }
    });
  }

  private async createPlayer(onReady: (deviceId: string) => void): Promise<any> {
    const {accessToken} = await getAccessToken();
    
    const player = new (window as any).Spotify.Player({
      name: 'Sorted MoodTunes Player',
      getOAuthToken: (cb: (token: string) => void) => {
        getAccessToken().then(({accessToken}) => {
          if (accessToken) cb(accessToken);
        });
      },
      volume: 0.5
    });

    // Ready
    player.addListener('ready', ({ device_id }: { device_id: string }) => {
      console.log('Ready with Device ID', device_id);
      onReady(device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player
    await player.connect();
    return player;
  }

  async playTrack(trackUri: string, deviceId?: string): Promise<void> {
    const client = await this.getClient();
    const endpoint = deviceId ? `/me/player/play?device_id=${deviceId}` : '/me/player/play';
    
    await client.player.startResumePlayback(deviceId, undefined, [trackUri]);
  }
}

export const spotifyService = new SpotifyService();