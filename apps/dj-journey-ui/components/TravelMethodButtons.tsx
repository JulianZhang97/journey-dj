import React, { useEffect, useState } from 'react';
import { TravelMethodProps } from 'types';

export function TravelMethodButtons(props: TravelMethodProps) {
  const { selectTravel } = props;
  return (
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
  );
}

export default TravelMethodButtons;
