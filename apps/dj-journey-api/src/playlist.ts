import { AxiosRequestConfig } from 'axios';
import * as express from 'express';
const router = express.Router();

import { getTripDuration } from './services/mapbox';
import { generatePlaylist } from './services/spotify';



router.get('/', async (req, res) => {
  //TODO: Need request typings here

  const {origin, destination, travelType, spotifyToken, tripName} = req.query;

    //Request needs to include origin/destination + Spotify user credentails 
    const tripDuration = await getTripDuration(origin as string, destination as string, travelType as string);

    const generatedPlaylist = await generatePlaylist(tripDuration, spotifyToken as string);

    res.send({ 
      tripDurationSeconds: tripDuration,
      playlist: generatedPlaylist});
  });



export { router as playlist }