import axios from "axios";
import { LOCALSTORAGE_KEYS } from "./auth";

axios.defaults.baseURL = 'https://api.spotify.com/v1';
axios.defaults.headers['Content-Type'] = 'application/json';


export async function getCurrentUserProfile(localAccessToken){
    try{
        console.log("Fetching User Profile")
        if (localAccessToken === (null || undefined)) {
            console.warn("Missing access token in local storage!");
        }
        axios.defaults.headers['Authorization'] = `Bearer ${localAccessToken}`;
        const profileRes = await axios.get('/me');
        return profileRes.data;
    }
    catch(error){
        console.error("Failed to fetch user profile", error);
    }
};
