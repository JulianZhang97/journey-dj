import axios from 'axios';


export async function getTripDuration(origin: string, destination: string, travelType: string): Promise<number>{
    try{    
        const reqURL = `${process.env.MAPBOX_MATRIX_URL}/${travelType}/${origin};${destination}`;
        const accessToken = process.env.MAPBOX_TOKEN
        const params = {
            access_token: accessToken,
            sources: 0,
            destinations: 1
        }

        const tripInfo = (await axios.get(reqURL, {params})).data;
        
        return tripInfo.durations[0][0];
    }
    catch(error){
        console.error("An error occured!", error);
    } 
}

