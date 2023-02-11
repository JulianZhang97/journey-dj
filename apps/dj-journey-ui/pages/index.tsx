import React, { useEffect, useState } from 'react';
import { useToken, logOut, loadToken } from '../common/auth';
import { getCurrentUserProfile } from '../common/spotify';
import SignInButton from '../components/SignInButton';
import { useRouter } from 'next/router';
import CreatePlaylist from '../components/CreatePlaylist';

//nx serve dj-journey-ui

export function Index() {
  const { query, isReady } = useRouter();

  const [token, setToken] = useState<string>(null);
  const [profile, setProfile] = useState<SpotifyApi.CurrentUsersProfileResponse>(null);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        setProfile(await getCurrentUserProfile(token));
      };

      fetchData();
    }
  }, [token]);

  useEffect(() => {
    if (isReady && query.access_token) {
      console.log('Token detected in query params...loading');
      loadToken();
    }
    setToken(useToken);
  }, [isReady]);

  return (
    <div>
      <div className="wrapper">
        <div className="container headerContainer">
        <div id="welcomeImage">
                <img src="https://cdn-icons-png.flaticon.com/128/7306/7306093.png" />
          </div>
         {!profile && (<div>
              <div className="headerText">
                <div>
                  <p className="welcomeText title"> Hello there, </p>
                </div>
                <div>
                  <h1 className="welcomeText title2">Welcome to DJ Journey 👋</h1>
                </div>
              </div>
            </div>
          )}
          {profile &&(
            <div className="headerText"> 
              <h1 className="title2">Welcome Back {profile.display_name}!</h1>
              <p className="title centerText">Let's make a playlist...</p>
            </div>
          )}
        </div>
        {!profile && (
          <div className="container buttonContainer">{<SignInButton />}</div>
        )}
        {profile && (
            <CreatePlaylist spotifyToken={token}/>
        )}
        <button className="button-pill" onClick={logOut}>Logout</button>
      </div>
    </div>
  );
}

export default Index;
