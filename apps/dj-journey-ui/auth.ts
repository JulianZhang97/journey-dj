import axios from "axios";
import router from "next/router";
import { checkTokenExpiry, LOCALSTORAGE_KEYS } from "./utils";



export const useToken = () => {
    const { access_token, refresh_token, expires_in, error} = router.query;
    
    const localAccessToken = window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken);
    const localTokenExpireTime = window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime);
    const localTokenTimestamp = window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp);

    if (error || checkTokenExpiry(localTokenExpireTime, localTokenTimestamp) || localAccessToken === 'undefined'){
      console.log("Invalid token found! Refreshing now...");
      refreshToken();
    }
    
    if (localAccessToken && localAccessToken !== 'undefined'){
      console.log("Valid token found locally. Setting now...");
      return localAccessToken;
    }

    
    if (access_token){
      console.log("User Logged In. Saving token to local storage")
      window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, access_token as string);
      window.localStorage.setItem(LOCALSTORAGE_KEYS.refreshToken, refresh_token as string);
      window.localStorage.setItem(LOCALSTORAGE_KEYS.expireTime, expires_in as string);
      window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now().toString());
      
      return access_token;
    }
}
  

export const refreshToken = async () => {
    try {
      const localRefreshToken = window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken);
      const localTokenTimestamp = window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp);

  
      // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
      if (!localRefreshToken || localRefreshToken === 'undefined' ||
        (Date.now() - Number(localTokenTimestamp) / 1000) < 1000
      ) {
        console.error('No refresh token available');
        logOut();
      }
      const { data } = await axios.get(`${process.env.SERVER_URL}:${process.env.SERVER_PORT}/login/refresh_token?refresh_token=${localRefreshToken}`);
      console.log("New Access Token", data.access_token)
  
      window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, data.access_token);
      window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now().toString());

      window.location.reload();
  
    } catch (e) {
      console.error(e);
    }
  };
  


export const logOut = () => {
    for (const property in LOCALSTORAGE_KEYS) {
      window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
    }
    // window.location = window.location.origin;
  }

  