import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import { useEffect, useState } from 'react';
import { createPlaylist } from '../common/spotify';
import { setAddressResult } from '../common/utils';
import styles from '../pages/index.module.scss';
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

export function CreatePlaylist(props: CreatePlaylistProps) {
  const { spotifyToken } = props;
  const [step, setStep] = useState<number>(0);

  const [origin, setOrigin] = useState<number[]>(null);
  const [originName, setOriginName] = useState<string>();
  const [destination, setDestination] = useState<number[]>(null);
  const [destinationName, setDestinationName] = useState<string>();

  const [travelType, setTravelType] = useState<string>(null);
  const [playlistName, setPlaylistName] = useState<string>(null);

  //   useEffect(() => {
  //     console.log('Current Step Is', step);
  //   }, [step]);

  function nextStep() {
    // TODO: Enable this when fixes are done
    // if (step === Object.keys(stepMap).length - 2){
    //     loadPlaylist();
    // }

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

  //   useEffect(() => {
  //     if (originName && destinationName) {
  //       setPlaylistName(
  //         `Playlist for my trip from ${originName} to ${destinationName}`
  //       );
  //     }
  //   }, [originName, destinationName]);

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
    createPlaylist(params);
  }

  useEffect(() => {
    if (stepMap[step] === 'origin' || stepMap[step] === 'destination') {
      const locationGeocoder = new MapboxGeocoder({
        accessToken: process.env.MAPBOX_TOKEN,
      });
      locationGeocoder.addTo('#addressBox');
      locationGeocoder.on('result', (input) => {
        if (stepMap[step] === 'origin') {
          setOrigin(input.result.center);
          setOriginName(input.result.place_name);
        } else if (stepMap[step] === 'destination') {
          setDestination(input.result.center);
          setDestinationName(input.result.place_name);
        }
        locationGeocoder.clear();
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
      {step === Object.keys(stepMap).length - 1 && (
        <UserMap
          spotifyToken={spotifyToken}
          origin={origin}
          destination={destination}
        />
      )}
      <div className="playlistButtons">
        {step !== 0 && (
          <button
            onClick={prevStep}
            className="button-pill rounded playlistButton"
          >
            Back
          </button>
        )}
        {step !== Object.keys(stepMap).length - 1 && (
          <button
            onClick={nextStep}
            className="button-pill rounded playlistButton"
          >
            {step === Object.keys(stepMap).length - 2
              ? `Create Playlist`
              : `Next`}
          </button>
        )}
      </div>
      <div className="resultsContainer">
        {travelType && (
          <button className="button-pill rounded">{travelType}</button>
        )}
        {originName && (
          <button className="button-pill rounded">{originName}</button>
        )}
        {destinationName && (
          <button className="button-pill rounded">{destinationName}</button>
        )}
        {playlistName && (
          <button className="button-pill rounded">{playlistName}</button>
        )}
      </div>
    </div>
  );
}

export default CreatePlaylist;
