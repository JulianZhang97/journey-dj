import styles from './index.module.scss';
import React, { useEffect, useState } from 'react';
import { useToken, logOut, loadToken } from '../common/auth';
import { getCurrentUserProfile } from '../common/spotify';
import UserMap from '../components/UserMap';
import SignInButton from '../components/SignIn/SignInButton';
import {useRouter} from "next/router";

//nx serve dj-journey-ui

export function Index() {
  const {query, isReady} = useRouter();

  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (token){
      const fetchData = async () => {
        setProfile(await getCurrentUserProfile(token));
      };
  
      fetchData();
    }
  }, [token])

  useEffect(() => {
    if(isReady && query.access_token){
      console.log("Token detected in query params...loading");
      loadToken();
    }
    setToken(useToken);

  }, [isReady]);


  return (
    <div className={styles.page}>
      <div>
        <div className="wrapper">
          <div className="container">
            <div id="welcome">
              <div className="titleContainer"><p className="titleText"> Hello there, </p></div>
              <div className="titleContainer"><h1 className="titleText2">Welcome to DJ Journey 👋</h1></div>
            </div>
          </div>
          <div className="container">
            {profile ? <h1>Signed in to Spotify!</h1> : <SignInButton/> }
          </div>
          {profile && (
            <div>
              <h1>Welcome Back {profile.display_name}!</h1>
              <UserMap spotifyToken={token} />
            </div>
          )}
          <button onClick={logOut}>LOGOUT</button>
        </div>
      </div>
    </div>
  );
}

export default Index;
