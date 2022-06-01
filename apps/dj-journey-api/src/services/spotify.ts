import axios from 'axios';
import { topLimit } from '../constants';

axios.defaults.baseURL = 'https://api.spotify.com/v1';
axios.defaults.headers['Content-Type'] = 'application/json';

interface TopTrack {
    uri: string,
    popularityScore: number,
    durationMs: number
}

interface TopTrackWithId extends TopTrack {
    id: string
}

interface TopTrackDict {
    [index: string]: TopTrack
}

function getTopItemInfo(playListItem): TopTrackWithId {
    return {
        id: playListItem.id,
        uri: playListItem.uri,
        popularityScore: playListItem.popularity,
        durationMs: playListItem.duration_ms
    }
}

function getFavouriteTracks(timeRange: string){
    return axios.get('/me/top/tracks', {params: {limit: topLimit, time_range: timeRange}})
}


export async function generatePlaylist(tripDurationSeconds: number, spotifyToken: string){
    axios.defaults.headers['Authorization'] = `Bearer ${spotifyToken}`;

    // // try{

    // // }
    // catch(error){
    //     console.error("An error occured!", error);
    // } 
}

export async function generateUserTopItems(spotifyToken: string){
    try{
        axios.defaults.headers['Authorization'] = `Bearer ${spotifyToken}`;

        //Async call x3 to get short/medium/long-term favourites
        const shortTracksPromises = getFavouriteTracks("short_term");
        const medTracksPromises = getFavouriteTracks("medium_term");
        const longTracksPromises = getFavouriteTracks("long_term");

        const allTracks = await Promise.all([shortTracksPromises, medTracksPromises, longTracksPromises]);
        
        let topItemArray: TopTrackWithId[] = [];
        const favSongMap: TopTrackDict = {};

        //Promise await all and combine them together in an array 
        allTracks.forEach((trackRes) => {
            topItemArray = topItemArray.concat(trackRes.data.map((topSongItem) => getTopItemInfo(topSongItem)));
        });

        //Iterate through array and add to top track map so each track is added only once
        topItemArray.forEach((item: TopTrackWithId) => {
            if (!(item.id in favSongMap))
                favSongMap[item.id] = {uri: item.uri, popularityScore: item.popularityScore, durationMs: item.durationMs};
        });

        //Return map as array of top songs (should be unique)
    }

    catch(error){
        console.error("An error occured when trying to generate user's top Spotify songs:", error);
    }
}