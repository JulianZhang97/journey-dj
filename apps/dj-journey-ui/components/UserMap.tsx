import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useEffect, useRef, useState } from 'react';
import {Map, Layer, LayerProps, Source, MapRef } from 'react-map-gl';
import { MapProps } from 'types';
import { convertDurationSecondsToStr, generateBoundsFromCoordinates } from '../common/utils';


export function UserMap(props: MapProps) {
  const { tripData } = props;

  const [routeDataLayerProps, setRouteDataLayerProps] = useState<any>();
  const [geoJSON, setGeoJSON] = useState<any>();
  
    useEffect(() => {
      const route = tripData.tripInfo.geometry.coordinates;
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };
      setGeoJSON(geojson);
      const routeProps = {
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          "line-color": '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      }
      setRouteDataLayerProps(routeProps);
    }, [tripData]);  

  return (
    <div>
      <h1 className="prompt">
        Your trip will take about {convertDurationSecondsToStr(tripData.tripDuration)}
      </h1>
      {tripData && <div className="mapContainer">
        <Map
          initialViewState={{
            bounds: generateBoundsFromCoordinates(tripData.tripInfo.geometry.coordinates),
            fitBoundsOptions: {padding: 40, animate: true, }
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={process.env.MAPBOX_TOKEN}
        >
          {geoJSON && routeDataLayerProps && <Source type="geojson" data={geoJSON}>
            <Layer {...routeDataLayerProps} />
          </Source>}
          </Map>
      </div>}
    </div>
  );
}

export default UserMap;
