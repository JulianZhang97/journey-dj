/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

//Run command nx serve my-app

import * as express from 'express';

import { playlist } from './playlist';


const app = express();

app.use('/api/playlist', playlist);

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to dj-journey-api!' });
});



const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
