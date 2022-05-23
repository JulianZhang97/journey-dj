/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

//Run command nx serve my-app

import * as express from 'express';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

import { playlist } from './playlist';
import { auth } from './auth'


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
