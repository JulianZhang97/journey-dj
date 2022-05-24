import * as express from 'express';
import axios from 'axios';
import * as qs from 'qs';

const router = express.Router();    


router.get('/', function(req, res) {
  const state = Math.random().toString(16);
  const scope = 'user-read-email user-top-read user-library-read playlist-read-private playlist-modify-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      redirect_uri: `${process.env.SERVER_URL}:${process.env.SERVER_PORT}/login/callback`,
      scope: scope,
      state: state
    }));
});


router.get('/callback', async function(req, res) {
    try{
        const code = req.query.code || null;
        const headers =  {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
        }
    
        const data = {
            grant_type: 'authorization_code',
            redirect_uri:  `${process.env.SERVER_URL}:${process.env.SERVER_PORT}/login/callback`,
            code: code as string
        }
    
        
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: qs.stringify(data), 
            headers
        });
        

        if (tokenResponse.status === 200) {
            const { access_token, token_type, refresh_token, expires_in } = tokenResponse.data;

            const queryParams = qs.stringify({
                access_token,
                refresh_token,
                expires_in
            })

            res.redirect(`${process.env.CLIENT_URL}:${process.env.CLIENT_PORT}/?${queryParams}`)

            // const userProfileRes = await axios.get('https://api.spotify.com/v1/me', {
            //     headers: {
            //     Authorization: `${token_type} ${access_token}`
            //     }
            // })
            // res.send(`<pre>${JSON.stringify(userProfileRes.data, null, 2)}</pre>`);
            // res.send(`<pre>${JSON.stringify(tokenResponse.data, null, 2)}</pre>`);
        } 
        else {
            res.send(tokenResponse);
        }
    }
    catch(error){
        console.error("Callback error occured", error);
        res.send(error);
    }
  });

router.get('/refresh_token', async function(req, res) {
  try{
    console.log("Refreshing Token")

    const { refresh_token } = req.query;
    const headers =  {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${new Buffer(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      }

    const refreshRes = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: qs.stringify({
          grant_type: 'refresh_token',
          refresh_token: refresh_token
        }),
        headers
      });
      res.send(refreshRes.data);
  }
  catch(error){
    console.error("Refresh token error occured", error);
    res.send(error);
}       
})


export { router as auth }