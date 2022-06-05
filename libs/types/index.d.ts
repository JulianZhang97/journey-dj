export interface TopTrack {
    uri: string,
    popularityScore: number,
    durationMs: number
}

export interface TopTrackWithId extends TopTrack {
    id: string
}

export interface TopTrackDict {
    [index: string]: TopTrack
}

export interface PlaylistCreateResponse {
    playlistId: string,
    message: string,
    playlistLength: number,
    playlistDurationSeconds: number,
}