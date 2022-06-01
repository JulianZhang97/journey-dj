import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Map from 'react-map-gl';
import styles from '../pages/index.module.scss';


interface MapProps {
  spotifyToken: string
}

function setAddressResult(coordinateList: number[]): string {
  return `${coordinateList[0]},${coordinateList[1]}`
}

export function UserMap(props: MapProps) {
  const { spotifyToken } = props;

  const [origin, setOrigin] = useState<number[]>(null);
  const [originName, setOriginName] = useState<string>();
  const [destination, setDestination] = useState<number[]>(null);
  const [destinationName, setDestinationName] = useState<string>();
  
  // TODO: Add these as user editable fields
  const [travelType, setTravelType] = useState<string>('mapbox/driving');
  const [tripName, setTripName] = useState<string>('My Travel Playlist');

  useEffect(() => {
    console.log('origin is:', origin);
  }, [origin]);

  useEffect(() => {
    const originGeocoder = new MapboxGeocoder({
      accessToken: process.env.MAPBOX_TOKEN,
    });
    originGeocoder.addTo('#origin-container');
    originGeocoder.on('result', (input) => {
      setOrigin(input.result.center);
      setOriginName(input.result.place_name);
      originGeocoder.clear();
    });

    const destinationGeocoder = new MapboxGeocoder({
      accessToken: process.env.MAPBOX_TOKEN,
    });
    destinationGeocoder.addTo('#destination-container');
    destinationGeocoder.on('result', (input) => {
      setDestination(input.result.center);
      setDestinationName(input.result.place_name);
      destinationGeocoder.clear();
    });
  }, []);
  
  async function loadPlaylist(){
    if (!origin || origin.length !== 2 || !destination || destination.length !== 2)
      console.error("Missing required location data! Can't make playlist...");
  
    const params = {
      origin: setAddressResult(origin),
      destination: setAddressResult(destination),
      travelType,
      spotifyToken,
      tripName,
    }
    const tripRes = await axios.get(`${process.env.SERVER_URL}:${process.env.SERVER_PORT}/playlist`, { params });

    console.log(tripRes);
  }

  return (
    <div className={styles.container}>
    <div className={styles.addressContainer}>
      <div >
        {originName && <h1>{originName}</h1>}
        <div className={styles.addressBox} id="origin-container"></div>
      </div>
      <div>
        {destination && <h1>{destinationName}</h1>}
        <div className={styles.addressBox} id="destination-container"></div>
      </div>
    </div>
    {(origin || destination) && <div className={styles.mapContainer}>
      <Map 
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3.5
        }}
        style={{width: 600, height: 400}}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.MAPBOX_TOKEN}
      />
    </div>}
    <button onClick={loadPlaylist}>
      Load Playlist
    </button>
    </div>
  );
}

export default UserMap;
