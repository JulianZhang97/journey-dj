import React, { useEffect, useState } from 'react';
import { PlaylistButtonsProps } from 'types';
import { FINAL_USER_STEP, RESULT_STEP, stepMap } from './CreatePlaylist';


export function PlaylistButtons(props: PlaylistButtonsProps) {
    const {step, playlistName, prevStep, nextStep, startOver  } = props;


    return (
        <div className="playlistButtons">
        {step !== 0 && step <= FINAL_USER_STEP && (
          <button
            onClick={prevStep}
            className="button-pill rounded playlistButton"
          >
            Back
          </button>
        )}
        {step === FINAL_USER_STEP && (
          <button
            onClick={nextStep}
            disabled={!playlistName || playlistName.length === 0}
            className="button-pill rounded playlistButton"
          >
            Create Playlist
          </button>
        )}
        {step === RESULT_STEP && (
          <button
            onClick={startOver}
            className="button-pill rounded playlistButton"
          >
            Start Over
          </button>
        )}
      </div>
    )
}

export default PlaylistButtons;
