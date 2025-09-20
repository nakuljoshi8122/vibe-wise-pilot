// Spotify Web API integration
export interface SpotifyConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

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
  };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  tracks: {
    total: number;
  };
  images: { url: string }[];
}

export class SpotifyService {
  private config: SpotifyConfig;
  private accessToken: string | null = null;

  constructor() {
    this.config = {
      clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID || 'demo_client_id',
      redirectUri: `${window.location.origin}/callback`,
      scopes: [
        'user-read-private',
        'user-read-email',
        'playlist-read-private',
        'playlist-read-collaborative',
        'user-top-read',
        'user-read-recently-played'
      ]
    };
  }

  generateAuthUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      scope: this.config.scopes.join(' '),
      redirect_uri: this.config.redirectUri,
      state: Math.random().toString(36).substring(7)
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('spotify_access_token', token);
  }

  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('spotify_access_token');
    }
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  logout() {
    this.accessToken = null;
    localStorage.removeItem('spotify_access_token');
  }

  private async makeRequest(endpoint: string): Promise<any> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return response.json();
  }

  async getUserProfile() {
    return this.makeRequest('/me');
  }

  async getUserPlaylists(): Promise<SpotifyPlaylist[]> {
    const response = await this.makeRequest('/me/playlists?limit=20');
    return response.items;
  }

  async getRecommendations(mood: string): Promise<SpotifyTrack[]> {
    // Map moods to Spotify audio features
    const moodFeatures = {
      'Great': { valence: 0.8, energy: 0.7, danceability: 0.6 },
      'Calm': { valence: 0.5, energy: 0.3, acousticness: 0.7 },
      'Stressed': { valence: 0.3, energy: 0.2, acousticness: 0.8 },
      'Tired': { valence: 0.6, energy: 0.4, instrumentalness: 0.3 },
      'Focused': { valence: 0.5, energy: 0.5, instrumentalness: 0.6 },
      'Happy': { valence: 0.9, energy: 0.8, danceability: 0.8 }
    };

    const features = moodFeatures[mood as keyof typeof moodFeatures] || moodFeatures['Calm'];
    
    const params = new URLSearchParams({
      limit: '20',
      target_valence: features.valence.toString(),
      target_energy: features.energy.toString(),
      target_danceability: (features.danceability || 0.5).toString(),
      target_acousticness: (features.acousticness || 0.5).toString(),
      target_instrumentalness: (features.instrumentalness || 0.5).toString()
    });

    const response = await this.makeRequest(`/recommendations?${params.toString()}`);
    return response.tracks;
  }

  async getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<SpotifyTrack[]> {
    const response = await this.makeRequest(`/me/top/tracks?time_range=${timeRange}&limit=20`);
    return response.items;
  }
}

export const spotifyService = new SpotifyService();