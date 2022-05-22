const axios = require('axios');
require('dotenv').config();



async function getTripInfo(request){
    try{
        const {profile, origin, destination} = request.body;
    
        const tripInfo = await axios.get(`${process.env.MAPBOX_MATRIX_URL}/${profile}/${origin};${destination}`);

        console.log(tripInfo);
    }
    catch(error){
        console.error("An error occured!");
    } 
}





module.exports = { getTripInfo }