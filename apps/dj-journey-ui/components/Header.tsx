import React, { useEffect, useState } from 'react';
import { HeaderProps } from 'types';


export function Header(props: HeaderProps) {
    const { profile } = props;
    return (
        <div className="container headerContainer">
        <div id="welcomeImage">
                <img src="https://cdn-icons-png.flaticon.com/128/7306/7306093.png" />
          </div>
         {!profile && (<div>
              <div className="headerText">
                <div>
                  <p className="welcomeText title"> Hello there, </p>
                </div>
                <div>
                  <h1 className="welcomeText title2">Welcome to DJ Journey 👋</h1>
                </div>
              </div>
            </div>
          )}
          {profile &&(
            <div className="headerText"> 
              <h1 className="title2">Welcome Back {profile.display_name}!</h1>
              <p className="title centerText">Let's make a playlist...</p>
            </div>
          )}
        </div>
    )
}

export default Header;
