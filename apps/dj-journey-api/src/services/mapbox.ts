import axios from 'axios';


export async function getTripDuration(origin: string, destination: string, travelType: string): Promise<number>{
    try{    
        const tripPoints = encodeURIComponent(`${origin};${destination}`);
        const reqURL = `${process.env.MAPBOX_MATRIX_URL}/${travelType}/${tripPoints}`;

        // console.log(reqURL);
        const accessToken = process.env.MAPBOX_TOKEN
        const params = {
            access_token: accessToken
        }

        const tripInfo = (await axios.get(reqURL, {params})).data;
        const tripDuration = tripInfo.routes[0].legs[0].duration;
        console.log(`Estimated trip duration is ${tripDuration} seconds. Creating playlist now...`)
        
        return tripDuration;

    }
    catch(error){
        console.error("An error occured!", error.response);
    } 
}

