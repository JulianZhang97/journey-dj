import axios from 'axios';
import { CreatedPlaylistData, SpotifyCreatePlaylistRequest, TopTrack, TopTrackDict, TopTrackWithId } from 'types';
import { playlistSongAddLimit, userTopSongsLimit } from '../constants';
import {
  breakIntoChunks,
  catchAxiosError,
  getTopItemInfo,
  weightedSongSort,
} from '../utils';

axios.defaults.baseURL = 'https://api.spotify.com/v1';
axios.defaults.headers['Content-Type'] = 'application/json';

async function getFavouriteTracks(
  timeRange: string
): Promise<SpotifyApi.UsersTopTracksResponse> {
  try {
    return (
      await axios.get('/me/top/tracks', {
        params: { limit: userTopSongsLimit, time_range: timeRange },
      })
    ).data;
  } catch (error) {
    console.error("Failed to get user top tracks!");
    catchAxiosError(error);
  }
}

// async function getUserTopArtists(timeRange: string){
//     return axios.get('/me/top/artists', {params: {time_range: timeRange}});
// }

async function getCurrentUser(): Promise<SpotifyApi.CurrentUsersProfileResponse> {
  try {
    return (await axios.get('/me')).data;
  } catch (error) {
    console.error("Failed to get user profile!");
    catchAxiosError(error);
  }
}

async function addSongsToPlaylist(
  playlistId: string,
  songIds: string[]
): Promise<SpotifyApi.AddTracksToPlaylistResponse> {
  if (songIds.length > playlistSongAddLimit)
    throw Error(
      'Error! Cannot add more than 100 songs at a time to a Spotify playlist'
    );
  try {
    return (await axios.post(`/playlists/${playlistId}/tracks`, { uris: songIds })).data;
  } catch (error) {
    console.error(`Failed to add songs to playlist ${playlistId}!`);
    catchAxiosError(error);
  }
}

async function createUserPlaylist(
  playlistName: string
): Promise<SpotifyApi.CreatePlaylistResponse> {
  try {
    const curUser = await getCurrentUser();

    const newPlaylist: SpotifyCreatePlaylistRequest = {
      name: playlistName,
      description: `Playlist created for ${curUser.display_name} by DJ-Journey`,
      public: false,
    };
    return (await axios.post(`/users/${curUser.id}/playlists`, newPlaylist)).data;
  } catch (error) {
    console.error(`Failed to create user playlist with name ${playlistName}!`);
    catchAxiosError(error);
  }
}

export async function generatePlaylist(
  tripDurationSeconds: number,
  spotifyToken: string,
  playlistName: string
): Promise<CreatedPlaylistData> {
  axios.defaults.headers['Authorization'] = `Bearer ${spotifyToken}`;

  try {
    // Get all of user's top songs weighted shuffled based on their popularityScore
    const topUserSongs: TopTrack[] = await generateUserTopItems(spotifyToken);

    const playlistToCreate: TopTrack[] = [];
    let playlistTotalDurationSeconds = 0;
    let curIndex = 0;

    // Get total duration of trip, start adding songs to playlist. While duration of playlist is < total duration, keep adding songs
    while (
      playlistTotalDurationSeconds < tripDurationSeconds &&
      curIndex < topUserSongs.length - 1
    ) {
      const songToAdd = topUserSongs[curIndex];
      playlistToCreate.push(songToAdd);
      playlistTotalDurationSeconds += songToAdd.durationMs / 1000;
      curIndex += 1;
    }

    // If the playlist duration is shorter than trip duration, pass warning to client that playlist length is insufficient due to long trip duration
    if (playlistTotalDurationSeconds < tripDurationSeconds) {
      console.warn(
        'Warning! Due to long trip duration, created playlist duration is shorter than total trip duration.'
      );
    }

    // Create spotify playlist with these songs and return this playlist to the client
    const playlistId = (await createUserPlaylist(playlistName)).id;

    // Add all songs from playlistToCreate into the playlist
    // Need to break playlist songs list to chunks of 100 to add to playlist at a time due to Spotify API limit
    const playlistSongsToAdd: TopTrack[][] = breakIntoChunks(
      playlistToCreate,
      playlistSongAddLimit
    )
    
    const addSongsPromises: Promise<SpotifyApi.AddTracksToPlaylistResponse>[] = playlistSongsToAdd.map(async (playlistChunkSongs: TopTrack[]) => {
      return await addSongsToPlaylist(
        playlistId,
        playlistChunkSongs.map((song: TopTrack) => song.uri)
      );
    });

    await Promise.all(addSongsPromises);

    console.log("Playlist Created!");

    // Pass playlist ID and any messages (e.g. success! playlist duration shorter than total trip duration) back to client side
    return {
      playlistId,
      message: `Playlist ${playlistName} successfully created.`,
      playlistLength: playlistToCreate.length,
      playlistDurationSeconds: playlistTotalDurationSeconds,
    } as CreatedPlaylistData;
  } catch (error) {
    console.error('An error occured while generating the playlist!', error);
  }

  // Future TODO:
  // If all songs from user's top items are added and playlist duration is still less than trip duration, load 5 songs from users' top 20 artists
  // Go through 100 songs from top artists and randomly add them to the trip playlist until reaching the trip duration limit or until all 100 songs are added

  // Add additional songs based on "song suggestions" if additional songs still needed
}

export async function generateUserTopItems(
  spotifyToken: string
): Promise<TopTrack[]> {
  try {
    axios.defaults.headers['Authorization'] = `Bearer ${spotifyToken}`;

    //Async call x3 to get short/medium/long-term favourites
    const shortTracksPromises: Promise<SpotifyApi.UsersTopTracksResponse> = getFavouriteTracks('short_term');
    const medTracksPromises: Promise<SpotifyApi.UsersTopTracksResponse> = getFavouriteTracks('medium_term');
    const longTracksPromises: Promise<SpotifyApi.UsersTopTracksResponse> = getFavouriteTracks('long_term');

    const allTracks: SpotifyApi.UsersTopTracksResponse[] = await Promise.all([
      shortTracksPromises,
      medTracksPromises,
      longTracksPromises,
    ]);

    let topItemArray: TopTrackWithId[] = [];
    const favSongDict: TopTrackDict = {};

    //Promise await all and combine them together in an array
    allTracks.forEach((trackRes: SpotifyApi.UsersTopTracksResponse) => {
      topItemArray = topItemArray.concat(
        trackRes.items.map((topSongItem: SpotifyApi.TrackObjectFull) => getTopItemInfo(topSongItem))
      );
    });

    //Iterate through array and add to top track map so each track is added only once
    topItemArray.forEach((item: TopTrackWithId) => {
      if (!(item.id in favSongDict))
        favSongDict[item.id] = {
          uri: item.uri,
          popularityScore: item.popularityScore,
          durationMs: item.durationMs,
        };
    });

    //Return map as array of top songs (should be unique) WEIGHTED SORTED by user song popularity
    return Object.values(favSongDict).sort(weightedSongSort);
  } catch (error) {
    console.error(
      "An error occured when trying to generate user's top Spotify songs:",
      error
    );
  }
}
