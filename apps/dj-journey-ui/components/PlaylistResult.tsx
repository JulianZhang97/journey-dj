import React, { useEffect, useState } from 'react';
import { PlaylistResultProps } from 'types';
import UserMap from './UserMap';


export function PlaylistResult(props: PlaylistResultProps) {
    const { tripData, playlistInfo } = props;
    return (
        <div>
        {tripData && playlistInfo && (
            <div className="resultsContainer">
              <UserMap
                tripData={tripData}
              />
              <h1 className="prompt">This is your playlist:</h1>
              <iframe src={`https://open.spotify.com/embed/playlist/${playlistInfo.playlistId}?utm_source=generator`} width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
      )}
      </div>
    )
}

export default PlaylistResult;
