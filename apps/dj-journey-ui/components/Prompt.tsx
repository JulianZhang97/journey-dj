import React, { useEffect, useState } from 'react';
import { PromptProps } from 'types';
import { promptMap } from '../common/utils';



export function Prompt(props: PromptProps) {
    const { step } = props;
    return (
        <div className="promptContainer">
        <p className="prompt">{promptMap[step]}</p>
      </div>
    )
}

export default Prompt;
