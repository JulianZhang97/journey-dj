import axios from "axios";
import { LOCALSTORAGE_KEYS } from "./auth";

const localAccessToken = typeof window !== "undefined" ? window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken) : undefined;

axios.defaults.baseURL = 'https://api.spotify.com/v1';
if (localAccessToken === (null || undefined)) {
    console.warn("Missing access token in local storage!");
}
axios.defaults.headers['Authorization'] = `Bearer ${localAccessToken}`;
axios.defaults.headers['Content-Type'] = 'application/json';


export async function getCurrentUserProfile(){
    try{
        const profileRes = await axios.get('/me');
        return profileRes.data;
    }
    catch(error){
        console.error("Failed to fetch user profile", error);
    }
};
