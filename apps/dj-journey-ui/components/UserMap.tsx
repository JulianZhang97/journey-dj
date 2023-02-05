import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { useEffect, useState } from 'react';
import {Map, Layer, LayerProps, Source } from 'react-map-gl';
import { convertDurationSecondsToStr } from '../common/utils';

interface MapProps {
  tripDuration: number;
  tripInfo: any;
}

export function UserMap(props: MapProps) {
  const { tripDuration, tripInfo } = props;

  const [routeDataLayerProps, setRouteDataLayerProps] = useState<any>();
  const [geoJSON, setGeoJSON] = useState<any>();

    useEffect(() => {
      const route = tripInfo.geometry.coordinates;
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
    }, [tripInfo]);  

  return (
    <div>
      <h1 className="prompt">
        Your trip will take about {convertDurationSecondsToStr(tripDuration)}
      </h1>
      <div className="mapContainer">
        <Map
          initialViewState={{
            longitude: -100,
            latitude: 40,
            zoom: 1.0,
          }}
          style={{ width: 500, height: 300 }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={process.env.MAPBOX_TOKEN}
        >
          {geoJSON && routeDataLayerProps && <Source type="geojson" data={geoJSON}>
            <Layer {...routeDataLayerProps} />
          </Source>}
          </Map>
      </div>
    </div>
  );
}

export default UserMap;
