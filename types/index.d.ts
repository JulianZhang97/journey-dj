import e = require("express");


//Frontend component typings
export interface MapProps {
  tripData: MapboxTripData;
}

export interface CreatePlaylistComponentProps {
  spotifyToken: string;
}



// Playlist Song Genereation Typings

export interface TopTrack {
  uri: string;
  popularityScore: number;
  durationMs: number;
}

export interface TopTrackWithId extends TopTrack {
  id: string;
}

export interface TopTrackDict {
  [index: string]: TopTrack;
}






//Key requests/responses with 3rd-party APIs
export interface CreatedPlaylistData {
  playlistId: string;
  message: string;
  playlistLength: number;
  playlistDurationSeconds: number;
}

export interface MapboxTripData {
  tripDuration: number, 
  tripInfo
}

export interface SpotifyCreatePlaylistRequest {
  name: string,
  description: string,
  public: boolean,
}

export interface SpotifyRefreshTokenResponse {
  access_token: string,
  expires_in: string,
  refresh_token: string
}




export interface CreatePlaylistReqQuery {
  originCoordStr: string;
  destinationCoordStr: string;
  travelType: string;
  spotifyToken: string;
  playlistName: string;
}

export interface CreatePlaylistRes {
  tripRes: MapboxTripData,
   playlist: PlaylistInfo
}



export interface PlaylistInfo {
  message: string;
  playlistDurationSeconds: number;
  playlistId: string;
  playlistLength: number;
}





