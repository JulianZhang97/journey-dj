import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import { useEffect, useState } from 'react';
import { createPlaylist } from '../common/spotify';
import { setAddressResult } from '../common/utils';
import UserMap from './UserMap';

export interface PlaylistParams {
  originCoordStr: string;
  destinationCoordStr: string;
  travelType: string;
  spotifyToken: string;
  playlistName: string;
}

interface CreatePlaylistProps {
  spotifyToken: string;
}

interface PlaylistInfo {
  message: string;
  playlistDurationSeconds: number;
  playlistId: string;
  playlistLength: number;
}

export interface PlaylistRes {
  tripDuration: number;
  playlist: PlaylistInfo;
  tripInfo: any;
}

const stepMap = {
  0: 'travelType',
  1: 'origin',
  2: 'destination',
  3: 'name',
  4: 'result',
};

const promptMap = {
  0: 'How are you travelling? 🧳',
  1: 'Where are you starting from? 🛫',
  2: 'Where are you going to? 🛬',
  3: 'What would you like to name your playlist? 📝',
  4: 'Playlist Created! Take a look below:',
};

const travelTypeMap = {
  'mapbox/cycling': 'Cycling',
  'mapbox/driving-traffic': 'Driving',
  'mapbox/walking': 'Walking',
};

export function CreatePlaylist(props: CreatePlaylistProps) {
  const { spotifyToken } = props;
  const [step, setStep] = useState<number>(0);

  // const [origin, setOrigin] = useState<number[]>([-79.383935, 43.653482]);
  const [origin, setOrigin] = useState<number[]>(null);
  // const [destination, setDestination] = useState<number[]>([
  //   -75.690057, 45.421143
  // ]);
  const [destination, setDestination] = useState<number[]>(null);

  const [originName, setOriginName] = useState<string>();
  const [destinationName, setDestinationName] = useState<string>();

  const [travelType, setTravelType] = useState<string>(null);
  const [playlistName, setPlaylistName] = useState<string>(null);

  const [tripDuration, setTripDuration] = useState<number>(null);
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo>(null);
  const [tripInfo, setTripInfo] = useState(null);

  //   useEffect(() => {
  //     console.log('Current Step Is', step);
  //   }, [step]);

  function nextStep() {
    // TODO: Enable this when fixes are done
    if (step === Object.keys(stepMap).length - 2) {
      loadPlaylist();
    }

    if (step <= Object.keys(stepMap).length - 2) {
      removeGeoCoderBox();
      setStep(step + 1);
    }
  }
  function prevStep() {
    if (step > 0) {
      removeGeoCoderBox();
      setStep(step - 1);
    }
  }

  function startOver() {
    setStep(0);
    setOrigin(null);
    setDestination(null);
    setOriginName(null);
    setDestination(null);
    setTravelType(null);
    setPlaylistName(null);
    setTripDuration(null);
    setPlaylistInfo(null);
  }

  // Need to do this as the Geocoder box won't unrender otherwise
  function removeGeoCoderBox() {
    const geocoderEls = document.getElementsByClassName(
      'mapboxgl-ctrl-geocoder mapboxgl-ctrl'
    );
    if (geocoderEls.length > 0) {
      geocoderEls[0].remove();
    }
  }

  function handlePlaylistChange(event) {
    setPlaylistName(event.target.value);
  }

  function selectTravel(travelType: string) {
    setTravelType(travelType);
    nextStep();
  }

  async function loadPlaylist() {
    if (
      !origin ||
      origin.length !== 2 ||
      !destination ||
      destination.length !== 2
    ) {
      console.error("Missing required location data! Can't make playlist...");
      return;
    }
    if (!playlistName || !travelType) {
      console.error("Missing travel or playlist data! Can't make playlist...");
      return;
    }

    const params: PlaylistParams = {
      originCoordStr: setAddressResult(origin),
      destinationCoordStr: setAddressResult(destination),
      travelType,
      spotifyToken,
      playlistName,
    };
    try {
      const res = await createPlaylist(params);
      console.log(res);
      setTripDuration(res.tripDuration);
      setPlaylistInfo(res.playlist);
      setTripInfo(res.tripInfo);
    } catch (error) {
      console.error('Could not create playlist!', error);
    }
  }

  useEffect(() => {
    if (stepMap[step] === 'origin' || stepMap[step] === 'destination') {
      const locationGeocoder = new MapboxGeocoder({
        accessToken: process.env.MAPBOX_TOKEN,
      });
      locationGeocoder.addTo('#addressBox');
      locationGeocoder.on('result', (input) => {
        console.log(input.result.center);
        if (stepMap[step] === 'origin') {
          setOrigin(input.result.center);
          setOriginName(input.result.place_name);
        } else if (stepMap[step] === 'destination') {
          setDestination(input.result.center);
          setDestinationName(input.result.place_name);
        }
        locationGeocoder.clear();
        nextStep();
      });
    }
  }, [step]);

  return (
    <div className="container">
      <div className="promptContainer">
        <p className="prompt">{promptMap[step]}</p>
      </div>
      <div className="responseContainer">
        {stepMap[step] === 'travelType' && (
          <div className="travelButtonRow">
            <button
              className="button-pill rounded"
              onClick={() => selectTravel('mapbox/driving-traffic')}
            >
              Driving 🚗
            </button>
            <button
              className="button-pill rounded"
              onClick={() => selectTravel('mapbox/walking')}
            >
              Walking 🚶‍♀️
            </button>
            <button
              className="button-pill rounded"
              onClick={() => selectTravel('mapbox/cycling')}
            >
              Cycling 🚴
            </button>
          </div>
        )}
        {(stepMap[step] === 'origin' || stepMap[step] === 'destination') && (
          <div id="addressBox"></div>
        )}
        {stepMap[step] === 'name' && (
          <input
            type="search"
            id="playlist-name"
            className="input-box"
            name="name"
            placeholder="My Travel Playlist  ❤️"
            onChange={handlePlaylistChange}
          />
        )}
      </div>
      {tripDuration && (
        <div>
          {tripDuration && tripInfo && playlistInfo && (
            <div className="resultsContainer">
              <UserMap
                tripDuration={tripDuration}
                tripInfo={tripInfo}
              />
              <h1 className="prompt">This is your playlist:</h1>
              <iframe src={`https://open.spotify.com/embed/playlist/${playlistInfo.playlistId}?utm_source=generator`} width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
          )}
        </div>
      )}
      {step !== Object.keys(stepMap).length - 1 && (
        <div className="tripInfoContainer">
          {travelType && (
            <div className="tripInfoButtonContainer">
              <button className="button-pill rounded light-blue-button">
                <span>
                  <span>I will be travelling by</span>
                  {travelTypeMap[travelType]}
                </span>
              </button>
            </div>
          )}
          {originName && (
            <div className="tripInfoButtonContainer">
              <button className="button-pill rounded light-blue-button">
                <span>
                  <span>I will be leaving from</span>
                  {originName}
                </span>
              </button>
            </div>
          )}
          {destinationName && (
            <div className="tripInfoButtonContainer">
              <div />
              <button className="button-pill rounded light-blue-button">
                <span>
                  <span>I will be travelling to</span>
                  {destinationName}
                </span>
              </button>
            </div>
          )}
          {playlistName && (
            <div className="tripInfoButtonContainer">
              <div />
              <button className="button-pill rounded light-blue-button">
                <span>
                  <span>My playlist will be called</span>
                  {playlistName}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
      <div className="playlistButtons">
        {step !== 0 && step <= Object.keys(stepMap).length - 2 && (
          <button
            onClick={prevStep}
            className="button-pill rounded playlistButton"
          >
            Back
          </button>
        )}
        {step === Object.keys(stepMap).length - 2 && (
          <button
            onClick={nextStep}
            className="button-pill rounded playlistButton"
          >
            Create Playlist
          </button>
        )}
        {step === Object.keys(stepMap).length - 1 && (
          <button
            onClick={startOver}
            className="button-pill rounded playlistButton"
          >
            Start Over
          </button>
        )}
      </div>
    </div>
  );
}

export default CreatePlaylist;
