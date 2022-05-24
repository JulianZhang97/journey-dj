import * as express from 'express';
const router = express.Router();

import getTripInfo from './services/mapbox';



router.get('/', (req, res) => {
    //Request needs to include origin/destination + Spotify user credentails 
    const tripInfo = getTripInfo(req);

    res.send({ info: tripInfo });
  });



export { router as playlist }