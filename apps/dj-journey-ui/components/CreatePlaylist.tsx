import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import { useEffect, useState } from 'react';
import { PlaylistInfo, CreatePlaylistComponentProps, CreatePlaylistReqQuery, MapboxTripData } from 'types';
import { logOut } from '../common/auth';
import { createPlaylist } from '../common/playlist';
import { getUserLocation, setAddressResult } from '../common/utils';
import { PlaylistButtons } from './PlaylistButtons';
import PlaylistResult from './PlaylistResult';
import Prompt from './Prompt';
import TravelMethodButtons from './TravelMethodButtons';



export const stepMap = {
  0: 'travelType',
  1: 'origin',
  2: 'destination',
  3: 'name',
  4: 'result',
};

const travelTypeMap = {
  'mapbox/cycling': 'Cycling',
  'mapbox/driving-traffic': 'Driving',
  'mapbox/walking': 'Walking',
};

export const FINAL_USER_STEP =  Object.keys(stepMap).length - 2
export const RESULT_STEP =  Object.keys(stepMap).length - 1

export function CreatePlaylist(props: CreatePlaylistComponentProps) {
  const { spotifyToken } = props;
  const [step, setStep] = useState<number>(0);
  
  const [origin, setOrigin] = useState<number[]>(null);
  const [destination, setDestination] = useState<number[]>(null);
  const [originName, setOriginName] = useState<string>();
  const [destinationName, setDestinationName] = useState<string>();
  const [travelType, setTravelType] = useState<string>(null);
  const [playlistName, setPlaylistName] = useState<string>(null);

  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo>(null);
  const [tripData, setTripData] = useState<MapboxTripData>(null);
  const [userCoords, setUserCoords] = useState<{longitude: string, latitude:string}>(null);

    useEffect(() => {
      removeGeoCoderBox();
    }, [step]);

    useEffect(() => {
      if (stepMap[step] === 'origin' || stepMap[step] === 'destination') {
        loadSearchBox();
      }
    }, [step]);

    useEffect(() => {
      async function setUserLocation(){
        const loc = await getUserLocation();
        if (loc){
          setUserCoords(loc);
        }
      }
      setUserLocation();
    }, []);




  function nextStep() {
    if (step === Object.keys(stepMap).length - 2) loadPlaylist();
    
    if (step <= Object.keys(stepMap).length - 2) setStep(step + 1);

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
    setDestinationName(null);
    setTravelType(null);
    setPlaylistName(null);
    setTripData(null);
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

    const params: CreatePlaylistReqQuery = {
      originCoordStr: setAddressResult(origin),
      destinationCoordStr: setAddressResult(destination),
      travelType,
      spotifyToken,
      playlistName,
    };
    try {
      const res = await createPlaylist(params);
      console.log(res);
      setTripData(res.tripRes);
      setPlaylistInfo(res.playlist);
    } catch (error) {
      console.error('Could not create playlist!', error);
    }
  }



  async function loadSearchBox() {
    const locationGeocoder = new MapboxGeocoder({
      accessToken: process.env.MAPBOX_TOKEN,
    });
    if(userCoords)
      locationGeocoder.setProximity(userCoords);
    
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
 


  return (
    <div className="container">
      <Prompt step={step}/>
      <div className="responseContainer">
        {stepMap[step] === 'travelType' && (
          <TravelMethodButtons selectTravel={selectTravel}/>
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
      <PlaylistResult tripData={tripData} playlistInfo={playlistInfo} />
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
      <PlaylistButtons startOver={startOver} prevStep={prevStep} nextStep={nextStep} step={step} playlistName={playlistName}/>
      <div className="footerContainer">
      <button className="button-pill rounded logoutButton" onClick={logOut}>
            Logout
          </button>
      </div>
    </div>
  );
}

export default CreatePlaylist;
