import * as express from 'express';
import { MapboxTripData, CreatePlaylistReqQuery, CreatePlaylistRes } from 'types';
import { getTripDuration } from '../services/mapbox';
import {
  generatePlaylist
} from '../services/spotify';
const router = express.Router();
//TODO: Add error handling and responses to client

router.get('/', async (req, res: express.Response<CreatePlaylistRes | {error: string}>) => {
  //TODO: Need request typings here

  const { originCoordStr, destinationCoordStr, travelType, spotifyToken, playlistName } = req.query;

  try{
  //Request needs to include origin/destination + Spotify user credentails
  const tripRes: MapboxTripData  = await getTripDuration(
    originCoordStr as string,
    destinationCoordStr as string,
    travelType as string
  );

  const {tripDuration, tripInfo} = tripRes;

  if (!tripDuration) throw Error("Missing trip duration information! Cannot make playlist...");

  if (!spotifyToken) throw Error("Missing Spotify token! Cannot make playlist...");

  const generatedPlaylist = await generatePlaylist(
    tripDuration,
    spotifyToken as string,
    playlistName as string
  );

  res.send({
    tripRes,
    playlist: generatedPlaylist,
  });
  }catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

// router.get('/topSongs', async (req, res) => {
//   //TODO: Need request typings here

//   const { spotifyToken } = req.query;

//   const topSongs = await generateUserTopItems(spotifyToken as string);
//   res.send({
//     topSongs,
//   });
// });

export { router as playlist };

