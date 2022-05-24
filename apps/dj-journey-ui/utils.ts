export const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timestamp: 'spotify_token_timestamp',
}

export const checkTokenExpiry = (expiryTime: string | undefined, timestamp: string | undefined) => {
    if (!expiryTime || !timestamp) {
      return false;
    }
    const millisecondsElapsed = Date.now() - Number(timestamp);
    return (millisecondsElapsed / 1000) > Number(expiryTime);
}

