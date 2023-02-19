import React, { useEffect, useState } from 'react';
import { useToken, loadToken } from '../common/auth';
import { getCurrentUserSpotifyProfile } from '../common/playlist';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Main from '../components/Main';

//nx serve dj-journey-ui
export function Index() {
  const { query, isReady } = useRouter();
  const [token, setToken] = useState<string>(null);
  const [profile, setProfile] = useState<SpotifyApi.CurrentUsersProfileResponse>(null);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        setProfile(await getCurrentUserSpotifyProfile(token));
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
  }, [isReady, query.access_token]);

  return (
    <div>
      <div className="wrapper">
        <Header profile={profile}/>
        <Main profile={profile} token={token}/>
      </div>
    </div>
  );
}

export default Index;
