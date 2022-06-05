import axios from 'axios';
import { topLimit } from '../constants';

axios.defaults.baseURL = 'https://api.spotify.com/v1';
axios.defaults.headers['Content-Type'] = 'application/json';


// TODO: Move these into typings file
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

async function getFavouriteTracks(timeRange: string){
    return axios.get('/me/top/tracks', {params: {limit: topLimit, time_range: timeRange}})
}

async function getUserTopArtists(timeRange: string){
    return axios.get('/me/top/artists', {params: {time_range: timeRange}})
}


function weightedSongSort(songA: TopTrack, songB: TopTrack): number {
    //Based on "Weighted Random Sampling algorithm from https://softwareengineering.stackexchange.com/questions/233541/how-to-implement-a-weighted-shuffle"
    const aVal = Math.random() ** (1.0 / songA.popularityScore);
    const bVal = Math.random() ** (1.0 / songB.popularityScore);

    return bVal - aVal;
}


export async function generatePlaylist(tripDurationSeconds: number, spotifyToken: string, tripName: string){
    axios.defaults.headers['Authorization'] = `Bearer ${spotifyToken}`;

    try {
        // Get all of user's top songs weighted shuffled based on their popularityScore
        const topUserSongs = await generateUserTopItems(spotifyToken);

        const playlistToCreate = [];
        let playlistTotalDurationSeconds = 0;
        let curIndex = 0;
        
        // Get total duration of trip, start adding songs to playlist. While duration of playlist is < total duration, keep adding songs
        while(playlistTotalDurationSeconds < tripDurationSeconds && curIndex < topUserSongs.length - 1){
            const songToAdd = topUserSongs[curIndex];
            playlistToCreate.push(songToAdd);
            playlistTotalDurationSeconds += songToAdd.durationMs / 1000
            curIndex += 1;
        }

        // If the playlist duration is shorter than trip duration, pass warning to client that playlist length is insufficient due to long trip duration
        if (playlistTotalDurationSeconds < tripDurationSeconds) {
            const warningMsg = "Warning! Due to long trip duration, created playlist does not have enough songs for then entire trip.";
        }        

        // Create spotify playlist with these songs and return this playlist to the client

        return playlistToCreate;

    }
    catch(error) {
        console.error("An error occured while generating the playlist!", error);
    }


    // Future TODO: 
    // If all songs from user's top items are added and playlist duration is still less than trip duration, load 5 songs from users' top 20 artists
    // Go through 100 songs from top artists and randomly add them to the trip playlist until reaching the trip duration limit or until all 100 songs are added

    // Add additional songs based on "song suggestions" if additional songs still needed
}



export async function generateUserTopItems(spotifyToken: string): Promise<TopTrack[]> {
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
            topItemArray = topItemArray.concat(trackRes.data.items.map((topSongItem) => getTopItemInfo(topSongItem)));
        });

        //Iterate through array and add to top track map so each track is added only once
        topItemArray.forEach((item: TopTrackWithId) => {
            if (!(item.id in favSongMap))
                favSongMap[item.id] = {uri: item.uri, popularityScore: item.popularityScore, durationMs: item.durationMs};
        });

        //Return map as array of top songs (should be unique) WEIGHTED SORTED by user song popularity 
        return Object.values(favSongMap).sort(weightedSongSort);
    }

    catch(error){
        console.error("An error occured when trying to generate user's top Spotify songs:", error);
    }
}