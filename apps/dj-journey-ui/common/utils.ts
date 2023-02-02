

export const checkTokenExpiry = (expiryTime: string | undefined, timestamp: string | undefined) => {
    if (!expiryTime || !timestamp) {
      return false;
    }
    const millisecondsElapsed = Date.now() - Number(timestamp);
    return (millisecondsElapsed / 1000) > Number(expiryTime);
}

export const closePopup = () => {
    window.opener.location.reload();
    window.close();
  }

export const setAddressResult = (coordinateList: number[]): string => {
    return `${coordinateList[0]},${coordinateList[1]}`
  }