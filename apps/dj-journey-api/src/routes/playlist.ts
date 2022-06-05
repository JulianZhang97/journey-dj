import * as express from 'express';
import { getTripDuration } from '../services/mapbox';
import {
  generatePlaylist
} from '../services/spotify';
const router = express.Router();

router.get('/', async (req, res) => {
  //TODO: Need request typings here

  const { origin, destination, travelType, spotifyToken, tripName } = req.query;

  //Request needs to include origin/destination + Spotify user credentails
  const tripDurationSeconds = await getTripDuration(
    origin as string,
    destination as string,
    travelType as string
  );

  const generatedPlaylist = await generatePlaylist(
    tripDurationSeconds,
    spotifyToken as string,
    tripName as string
  );

  res.send({
    tripDurationSeconds,
    playlist: generatedPlaylist,
  });
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

