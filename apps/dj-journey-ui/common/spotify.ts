import axios from "axios";
import { PlaylistParams, PlaylistRes } from "../components/CreatePlaylist";

axios.defaults.baseURL = 'https://api.spotify.com/v1';
axios.defaults.headers['Content-Type'] = 'application/json';


export const getCurrentUserProfile = async (localAccessToken: string) => {
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

export const createPlaylist = async (params: PlaylistParams): Promise<PlaylistRes> => {
    console.log(params);
    try{
        const tripRes = await axios.get(`${process.env.SERVER_URL}:${process.env.SERVER_PORT}/playlist`, { params });
        return tripRes.data;
    }
    catch(error){
        console.error("Failed to create playlist", error);
    }
}