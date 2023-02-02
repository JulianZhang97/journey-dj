import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useEffect, useState } from 'react';
import Map from 'react-map-gl';
// import styles from '../pages/index.module.scss';


interface MapProps {
  spotifyToken: string
  origin: number[],
  destination: number[] 
}



export function UserMap(props: MapProps) {
  const { spotifyToken, origin, destination } = props;

  return (
    <div className="mapContainer">
      {origin && destination && <Map 
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 1.0
        }}
        style={{width: 500, height: 300}}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={process.env.MAPBOX_TOKEN}
      />}
    </div>
  );
}

export default UserMap;
