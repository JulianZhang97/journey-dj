import axios from "axios";
import { CreatePlaylistReqQuery, CreatePlaylistRes } from "types";

axios.defaults.baseURL = 'https://api.spotify.com/v1';
axios.defaults.headers['Content-Type'] = 'application/json';


export const getCurrentUserSpotifyProfile = async (localAccessToken: string): Promise<SpotifyApi.CurrentUsersProfileResponse> => {
    try{
        console.log("Fetching User Profile")
        if (localAccessToken === (null || undefined)) {
            console.warn("Missing access token in local storage!");
        }
        axios.defaults.headers['Authorization'] = `Bearer ${localAccessToken}`;
        const profileRes = (await axios.get('/me')).data;
        return profileRes;
    }
    catch(error){
        console.error("Failed to fetch user profile", error);
    }
};

export const createPlaylist = async (params: CreatePlaylistReqQuery): Promise<CreatePlaylistRes> => {
    try{
        return (await axios.get(`${process.env.SERVER_URL}:${process.env.SERVER_PORT}/playlist`, { params })).data;
    }
    catch(error){
        console.error("Failed to create playlist", error);
    }
}