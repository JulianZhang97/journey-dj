import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

import { useEffect, useState } from 'react';
import { PlaylistInfo, CreatePlaylistComponentProps, MapboxTripData } from 'types';
import { logOut } from '../common/auth';
import { createPlaylistHelper, FINAL_USER_STEP, getUserLocation, stepMap } from '../common/utils';
import { PlaylistButtons } from './PlaylistButtons';
import PlaylistResponses from './PlaylistResponses';
import PlaylistResult from './PlaylistResult';
import Prompt from './Prompt';
import TravelMethodButtons from './TravelMethodButtons';


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
      if (stepMap[step] === 'origin' || stepMap[step] === 'destination') loadSearchBox();
    }, [step]);

    useEffect(() => {
      async function setUserLocation(){
        const loc = await getUserLocation();
        if (loc) setUserCoords(loc);
      }
      setUserLocation();
    }, []);

  function nextStep() {
    if (step === FINAL_USER_STEP) makePlaylist();
    setStep(step + 1);
  }
  function prevStep() {
    setStep(step - 1);
  }

  // Need to do this as the Geocoder box won't unrender otherwise
  function removeGeoCoderBox() {
    const geocoderEls = document.getElementsByClassName(
      'mapboxgl-ctrl-geocoder mapboxgl-ctrl'
    );
    if (geocoderEls.length > 0) geocoderEls[0].remove();
  }

  function handlePlaylistChange(event) {
    setPlaylistName(event.target.value);
  }

  function selectTravel(travelType: string) {
    setTravelType(travelType);
    nextStep();
  }

  async function makePlaylist() {
      const res = await createPlaylistHelper(origin, destination, playlistName, travelType, spotifyToken);
      setTripData(res.tripRes);
      setPlaylistInfo(res.playlist);
  }

  async function loadSearchBox() {
    const locationGeocoder = new MapboxGeocoder({
      accessToken: process.env.MAPBOX_TOKEN,
    });
    if(userCoords)
      locationGeocoder.setProximity(userCoords);
    
    locationGeocoder.addTo('#addressBox');
    locationGeocoder.on('result', (input) => {
      // console.log(input.result.center);
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
      <PlaylistResponses step={step} travelType={travelType} destinationName={destinationName} originName={originName} playlistName={playlistName} />
      <PlaylistButtons startOver={() => window.location.reload()} prevStep={prevStep} nextStep={nextStep} step={step} playlistName={playlistName}/>
      <div className="footerContainer">
      <button className="button-pill rounded logoutButton" onClick={logOut}>
            Logout
          </button>
      </div>
    </div>
  );
}

export default CreatePlaylist;
