import { Injectable } from '@angular/core';
import { get } from 'scriptjs';
import { SpotifyService } from './spotify.service';

declare let Spotify;

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  spotifyService: SpotifyService;
  player;

  constructor( SpotifyService: SpotifyService) {
    this.spotifyService = SpotifyService;

    get("https://sdk.scdn.co/spotify-player.js", () => {

      (window as any).onSpotifyWebPlaybackSDKReady = () => {
        //const token = [SpotifyService.getCurrentAccessToken()];
        this.player = new Spotify.Player({
          name: 'Web Playback SDK Quick Start Player',
          getOAuthToken: cb => cb(SpotifyService.getCurrentAccessToken())
        });
        console.log(this.player);
        // Error handling
      this.player.addListener('initialization_error', ({ message }) => { console.error(message); });
      this.player.addListener('authentication_error', ({ message }) => { console.error(message); });
      this.player.addListener('account_error', ({ message }) => { console.error(message); });
      this.player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      this.player.addListener('player_state_changed', state => { console.log(state); });

      // Ready
      this.player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      this.player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      this.player.connect();
    };


    });
    }
    play = ({
      spotify_uri,
      playerInstance: {
        _options: {
          getOAuthToken,
          id
        }
      }
    }) => {
      getOAuthToken(access_token => {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [spotify_uri] }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
          },
        });
      });
    };

    playSong(spotifyUri: string){
      this.play({
       playerInstance: this.player,
       spotify_uri: spotifyUri,
     });
   }

}

