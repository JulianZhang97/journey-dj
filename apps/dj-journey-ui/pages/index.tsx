import styles from './index.module.scss';
import React, { useEffect, useState } from "react";
import SignIn from '../SignIn/SignIn';
import { useToken } from '../auth';
import { getCurrentUserProfile } from '../spotify';
import UserMap from '../Map/UserMap';
//nx serve dj-journey-ui




export function Index() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    setToken(useToken);

    const fetchData = async () => {
        setProfile(await getCurrentUserProfile());
    };

    fetchData();
  }, []);


  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.scss file.
   */
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there, </span>
              Welcome dj-journey-ui 👋
            </h1>
          </div>
        </div>
        <div className="container">
          <SignIn accessToken={token}/>
        </div>
        {profile && <div>
          <h1>Welcome Back {profile.display_name}!</h1>
          <UserMap />
        </div>}
      </div>
    </div>
  );
}

export default Index;
