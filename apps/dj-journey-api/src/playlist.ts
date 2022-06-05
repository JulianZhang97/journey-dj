import { AxiosRequestConfig } from 'axios';
import * as express from 'express';
const router = express.Router();

import { getTripDuration } from './services/mapbox';
import { generatePlaylist, generateUserTopItems } from './services/spotify';



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


  router.get('/topSongs', async (req, res) => {
    //TODO: Need request typings here
  
    const {spotifyToken} = req.query;
    
      const topSongs = await generateUserTopItems(spotifyToken as string);

      res.send({ 
        topSongs});
    });



export { router as playlist }