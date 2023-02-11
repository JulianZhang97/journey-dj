import { AxiosError } from "axios";
import { TopTrack, TopTrackWithId } from "types";

export function getTopItemInfo(playListItem: SpotifyApi.TrackObjectFull): TopTrackWithId {
    return {
        id: playListItem.id,
        uri: playListItem.uri,
        popularityScore: playListItem.popularity,
        durationMs: playListItem.duration_ms
    }
}

export function weightedSongSort(songA: TopTrack, songB: TopTrack): number {
    //Based on "Weighted Random Sampling algorithm from https://softwareengineering.stackexchange.com/questions/233541/how-to-implement-a-weighted-shuffle"
    const aVal = Math.random() ** (1.0 / songA.popularityScore);
    const bVal = Math.random() ** (1.0 / songB.popularityScore);

    return bVal - aVal;
}

// https://stackabuse.com/how-to-split-an-array-into-even-chunks-in-javascript/
export function breakIntoChunks(songArr: TopTrack[], chunkSize: number): TopTrack[][]{
    const finalArr = [];
    for (let i = 0; i < songArr.length; i += chunkSize) {
        const chunk = songArr.slice(i, i + chunkSize);
        finalArr.push(chunk);
    }
    return finalArr;
}

//https://axios-http.com/docs/handling_errors
export function catchAxiosError(error: AxiosError): void {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', error.message);
      }
}