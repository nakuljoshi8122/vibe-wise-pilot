// Spotify Web API integration with proper OAuth 2.0 flow
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

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export class SpotifyService {
  private config: SpotifyConfig;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.config = {
      clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID || '1234567890abcdef1234567890abcdef',
      redirectUri: `${window.location.origin}${window.location.pathname}`,
      scopes: [
        'user-library-read',
        'user-read-email',
        'streaming',
        'user-read-private',
        'user-read-playback-state',
        'user-modify-playback-state'
      ]
    };

    // Load tokens from localStorage on initialization
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    this.accessToken = localStorage.getItem('spotify_access_token');
    this.refreshToken = localStorage.getItem('spotify_refresh_token');
    const expiry = localStorage.getItem('spotify_token_expiry');
    this.tokenExpiry = expiry ? parseInt(expiry) : null;
  }

  private saveTokensToStorage(tokenData: SpotifyTokenResponse) {
    this.accessToken = tokenData.access_token;
    this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000);
    
    localStorage.setItem('spotify_access_token', tokenData.access_token);
    localStorage.setItem('spotify_token_expiry', this.tokenExpiry.toString());
    
    if (tokenData.refresh_token) {
      this.refreshToken = tokenData.refresh_token;
      localStorage.setItem('spotify_refresh_token', tokenData.refresh_token);
    }
  }

  generateAuthUrl(): string {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('spotify_auth_state', state);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      scope: this.config.scopes.join(' '),
      redirect_uri: this.config.redirectUri,
      state: state,
      show_dialog: 'true'
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async handleAuthCallback(): Promise<boolean> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      console.error('Spotify auth error:', error);
      return false;
    }

    if (!code || !state) {
      return false;
    }

    const storedState = localStorage.getItem('spotify_auth_state');
    if (state !== storedState) {
      console.error('State mismatch in Spotify auth');
      return false;
    }

    try {
      const tokenData = await this.exchangeCodeForToken(code);
      this.saveTokensToStorage(tokenData);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      localStorage.removeItem('spotify_auth_state');
      
      return true;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      return false;
    }
  }

  private async exchangeCodeForToken(code: string): Promise<SpotifyTokenResponse> {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.config.redirectUri,
        client_id: this.config.clientId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status}`);
    }

    return response.json();
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          client_id: this.config.clientId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const tokenData = await response.json();
      this.saveTokensToStorage(tokenData);
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      return false;
    }
  }

  private isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    return Date.now() >= this.tokenExpiry - 60000; // Refresh 1 minute before expiry
  }

  async getValidAccessToken(): Promise<string | null> {
    if (!this.accessToken) return null;

    if (this.isTokenExpired()) {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) return null;
    }

    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && !this.isTokenExpired();
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
    localStorage.removeItem('spotify_auth_state');
  }

  private async makeRequest(endpoint: string): Promise<any> {
    const token = await this.getValidAccessToken();
    if (!token) {
      throw new Error('No valid access token available');
    }

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      // Try to refresh token once more
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        const newToken = await this.getValidAccessToken();
        const retryResponse = await fetch(`https://api.spotify.com/v1${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${newToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!retryResponse.ok) {
          throw new Error(`Spotify API error: ${retryResponse.status}`);
        }
        
        return retryResponse.json();
      } else {
        throw new Error('Authentication failed');
      }
    }

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return response.json();
  }

  async getUserProfile(): Promise<SpotifyUser> {
    return this.makeRequest('/me');
  }

  async getUserLikedSongs(limit: number = 20): Promise<SpotifyTrack[]> {
    const response = await this.makeRequest(`/me/tracks?limit=${limit}`);
    return response.items.map((item: any) => item.track);
  }

  async getRecommendations(mood: string, limit: number = 20): Promise<SpotifyTrack[]> {
    // Map moods to Spotify audio features and genres
    const moodConfig = {
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

    const config = moodConfig[mood as keyof typeof moodConfig] || moodConfig['Calm'];
    const selectedGenres = config.genres.slice(0, 3); // Max 3 seed genres
    
    const params = new URLSearchParams({
      limit: limit.toString(),
      seed_genres: selectedGenres.join(','),
      target_valence: config.valence.toString(),
      target_energy: config.energy.toString(),
    });

    if (config.danceability) {
      params.append('target_danceability', config.danceability.toString());
    }
    if (config.acousticness) {
      params.append('target_acousticness', config.acousticness.toString());
    }
    if (config.instrumentalness) {
      params.append('target_instrumentalness', config.instrumentalness.toString());
    }

    const response = await this.makeRequest(`/recommendations?${params.toString()}`);
    return response.tracks;
  }

  // Initialize Spotify Web Playback SDK
  initializeWebPlayback(onReady: (deviceId: string) => void): Promise<any> {
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
    const token = await this.getValidAccessToken();
    if (!token) {
      throw new Error('No access token for playback');
    }

    const player = new (window as any).Spotify.Player({
      name: 'Sorted MoodTunes Player',
      getOAuthToken: (cb: (token: string) => void) => {
        this.getValidAccessToken().then(token => {
          if (token) cb(token);
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
    const endpoint = deviceId ? `/me/player/play?device_id=${deviceId}` : '/me/player/play';
    
    await fetch(`https://api.spotify.com/v1${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${await this.getValidAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: [trackUri]
      })
    });
  }
}

export const spotifyService = new SpotifyService();