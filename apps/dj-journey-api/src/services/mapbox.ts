import axios from 'axios';


export default async function getTripInfo(request){
    try{
        const {profile, origin, destination} = request.query;
    
        const reqURL = `${process.env.MAPBOX_MATRIX_URL}/${profile}/${origin};${destination}`;
        const accessToken = process.env.MAPBOX_TOKEN
        const params = {
            access_token: accessToken,
            sources: 0,
            destinations: 1
        }

        const tripInfo = (await axios.get(reqURL, {params})).data;

        console.log(tripInfo);
        
        return tripInfo;
    }
    catch(error){
        console.error("An error occured!", error);
    } 
}

