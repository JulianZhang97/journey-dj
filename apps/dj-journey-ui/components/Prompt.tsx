import React, { useEffect, useState } from 'react';
import { PromptProps } from 'types';

const promptMap = {
    0: 'How are you travelling? 🧳',
    1: 'Where are you starting from? 🛫',
    2: 'Where are you going to? 🛬',
    3: 'What would you like to name your playlist? 📝',
    4: 'Playlist Created! Take a look below:',
  };

export function Prompt(props: PromptProps) {
    const { step } = props;
    return (
        <div className="promptContainer">
        <p className="prompt">{promptMap[step]}</p>
      </div>
    )
}

export default Prompt;
