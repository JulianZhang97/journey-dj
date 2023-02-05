import axios from 'axios';


export async function getTripDuration(origin: string, destination: string, travelType: string): Promise<{tripDuration: number, tripInfo}>{
    try{    
        const tripPoints = encodeURIComponent(`${origin};${destination}`);
        const reqURL = `${process.env.MAPBOX_MATRIX_URL}/${travelType}/${tripPoints}?steps=true&geometries=geojson`;

        const accessToken = process.env.MAPBOX_TOKEN
        const params = {
            access_token: accessToken
        }

        const tripRes = (await axios.get(reqURL, {params})).data;
        const tripDuration = tripRes.routes[0].duration;
        const tripInfo = tripRes.routes[0];
        
        return {tripDuration, tripInfo};

    }
    catch(error){
        const errorObj = error.response && error.response.data ? JSON.stringify(error.response.data) : "";
        throw Error("An error occured! " + errorObj);
    } 
}

