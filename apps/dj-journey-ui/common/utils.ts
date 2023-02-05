

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