/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

//nx serve dj-journey-api

import * as express from 'express';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

import { playlist } from './routes/playlist';
import { auth } from './routes/auth'


const app = express();
app.use(cors());

dotenv.config();

app.use('/playlist', playlist);
app.use('/login', auth);

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to dj-journey-api!' });
});



const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
