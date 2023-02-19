import React, { useEffect, useState } from 'react';
import { PlaylistResponsesProps } from 'types';
import { stepMap, travelTypeMap } from '../common/utils';

export function PlaylistResponses(props: PlaylistResponsesProps) {
  const { step, travelType, originName, destinationName, playlistName } = props;

  return (
    <div>
      {step !== Object.keys(stepMap).length - 1 && (
        <div className="tripInfoContainer">
          {travelType && (
            <div className="tripInfoButtonContainer">
              <button className="button-pill rounded light-blue-button tripInfoButton">
                <span>
                  <span>I will be travelling by</span>
                  {travelTypeMap[travelType]}
                </span>
              </button>
            </div>
          )}
          {originName && (
            <div className="tripInfoButtonContainer">
              <button className="button-pill rounded light-blue-button tripInfoButton">
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
              <button className="button-pill rounded light-blue-button tripInfoButton">
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
              <button className="button-pill rounded light-blue-button tripInfoButton">
                <span>
                  <span>My playlist will be called</span>
                  {playlistName}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PlaylistResponses;
