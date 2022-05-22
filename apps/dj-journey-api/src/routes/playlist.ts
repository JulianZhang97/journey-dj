import * as express from 'express';
const router = express.Router();



router.post('/', (req, res) => {
    //Request needs to include origin/destination + Spotify user credentails 
    res.send({ message: 'Welcome to dj-journey-api!' });
  });



export { router as playlist }