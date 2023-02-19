import { LngLatBoundsLike } from "react-map-gl";


export const checkTokenExpiry = (expiryTime: string | undefined, timestamp: string | undefined): boolean => {
    if (!expiryTime || !timestamp) {
      return false;
    }
    const millisecondsElapsed = Date.now() - Number(timestamp);
    return (millisecondsElapsed / 1000) > Number(expiryTime);
}

export const closePopup = (): void => {
    window.opener.location.reload();
    window.close();
  }

export const setAddressResult = (coordinateList: number[]): string => {
    return `${coordinateList[0]},${coordinateList[1]}`
  }

export const convertDurationSecondsToStr = (timeInSeconds: number): string => {
  let minutes = Math.floor(timeInSeconds / 60);
  // const seconds = timeInSeconds % 60;
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  const days = Math.floor(hours / 24);
  hours = hours % 24;

  const duration = [];
  if (days > 0) {
      duration.push(`${days} day${days > 1 ? 's' : ''}`);
  }
  if (hours > 0) {
      duration.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  }
  if (minutes > 0) {
      duration.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  }
  return duration.join(' ');
}

export const generateBoundsFromCoordinates = (coordinateArr: [number, number][]): LngLatBoundsLike => {
  if (coordinateArr.length === 0) throw Error("Invalid coordinates submitted! Cannot generate map bounds...");
  
  let minLat: number;
  let maxLat: number;
  let minLng: number;
  let maxLng: number;

  coordinateArr.forEach((coords) => {
    const curLat = coords[1];
    const curLng = coords[0];
    if (!minLat) minLat = curLat;
    if (!minLng) minLng = curLng;
    if (!maxLat) maxLat = curLat;
    if (!maxLng) maxLng = curLng;

    if (curLat < minLat) minLat = curLat;
    if (curLat > maxLat) maxLat = curLat;
    if (curLng < minLng) minLng = curLng;
    if (curLng > maxLng) maxLng = curLng;

  });

  return [[minLng, minLat], [maxLng, maxLat]]
}

export const getUserLocation = async (): Promise<{latitude: string, longitude: string} | null> =>  {
  function getPosition(options?: PositionOptions) {
    return new Promise((resolve, reject) => 
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );
  }

  const options = {
    timeout: 5000,
  };
  try{
    const pos: any = await getPosition(options)
    const {coords} = pos;
    return {longitude: coords.longitude, latitude: coords.latitude}
  }
  catch(err){
    console.error("Failed to get user location!", err.message);
    return null;
  }
  return null;
}

