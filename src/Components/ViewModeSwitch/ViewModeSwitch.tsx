import { Dispatch, SetStateAction, useState } from 'react';
import './ViewModeSwitch.css'

export default function ViewModeSwitch({isDarkMode, updateDarkModeState} : {isDarkMode: boolean, updateDarkModeState: Dispatch<SetStateAction<boolean>>}) {
  const darkMode = 'switch-button darkMode';
  const lightMode = 'switch-button-right lightMode';

  const cloud = (
    <div>
      <div className='cloud'>
        <div className='left' />
        <div className='top' />
        <div className='right'/>
        <div className='mid'/>
        <div className='bottom'/>
      </div>
      <div className='bird'>
        <div className='left' />
        <div className='right' />
      </div>
      <div className='bird bird-2'>
        <div className='left' />
        <div className='right' />
      </div>
    </div>
  );
  return (
    <div className='switchContainer'>
      <div className={isDarkMode ? 'background-switch' : 'background-switch-day'} onClick={() => updateDarkModeState(!isDarkMode)}>
        <div className={isDarkMode ? darkMode : lightMode}>
          {isDarkMode && (
            <div>
              <div className='spot left' />
              <div className='spot right' />
              <div className='spot below' />
              <div className='star blink' />
              <div className='st1 star blink' />
              <div className='st2 star blink' />
              <div className='st3 star blink' />
              <div className='st4 star blink' />
              <div className='st5 star blink' />
            </div>
          )}
        </div>
        {!isDarkMode && cloud}
      </div>
    </div>
  );
}