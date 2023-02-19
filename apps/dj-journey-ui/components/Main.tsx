import React, { useEffect, useState } from 'react';
import { MainProps } from 'types';
import CreatePlaylist from './CreatePlaylist';
import SignInButton from './SignInButton';

export function Main(props: MainProps) {
  const { profile, token } = props;
  return (
    <div className="mainContainer">
      {!profile && (
        <div className="container buttonContainer">{<SignInButton />}</div>
      )}
      {profile && <CreatePlaylist spotifyToken={token} />
      }
    </div>
  );
}

export default Main;
