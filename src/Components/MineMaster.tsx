import { useCallback, useEffect, useState } from 'react';
import MineGrid from './MineGrid/MineGrid';
import './MineMaster.css'
import ViewModeSwitch from './ViewModeSwitch/ViewModeSwitch';

export default function MineMaster() {
  const [isDarkMode, updateDarkModeState] = useState(true);
  const [isGameStarted, setGameStartStatus] = useState(false);
  const [showDificultyOptions, setShowDificultyOptionsStatus] = useState(false)
  const [selectedDificulty, setSelectedDificulty] = useState('EASY')

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? "#191818" : 'antiquewhite';
  }, [isDarkMode]);

  return (
    <div>
      <ViewModeSwitch
        isDarkMode={isDarkMode}
        updateDarkModeState={updateDarkModeState}
      />
      <div className='container'>
        {isGameStarted && <div className={`${!isDarkMode && 'arrowLight'} arrow `} onClick={() => {setGameStartStatus(false);setShowDificultyOptionsStatus(false)}} /> }
        <span
          className={`title ${isDarkMode ? 'lightTitle' : 'darkTitle'} ${isGameStarted ? 'title-top' : ''}`}>
          Mine Master
        </span>

        {!isGameStarted && (
          <div className='btnContainer'>
            <div onClick={() => setShowDificultyOptionsStatus(true)}>START GAME</div>
            <div>HOW TO PLAY</div>
          </div>
        )}
        {!isGameStarted && showDificultyOptions && (
          <div className={`${!isDarkMode && 'overlayLight'} optionsOverlay `}>
            <div className={`${isDarkMode ? 'cross' : 'crossDark'}`} onClick={() => setShowDificultyOptionsStatus(false)}/>
            <div className={`${isDarkMode ? 'option' : 'optionDark'}`} onClick={() => {setSelectedDificulty('NOVICE');setGameStartStatus(true)}}>Novice</div>
            <div className={`${isDarkMode ? 'option' : 'optionDark'}`} onClick={() => {setSelectedDificulty('EASY');setGameStartStatus(true)}}>Easy</div>
            <div className={`${isDarkMode ? 'option' : 'optionDark'}`} onClick={() => {setSelectedDificulty('MEDIUM');setGameStartStatus(true)}}>Medium</div>
            <div className={`${isDarkMode ? 'option' : 'optionDark'}`} onClick={() => {setSelectedDificulty('HARD');setGameStartStatus(true)}}>Hard</div>
            <div className={`${isDarkMode ? 'option' : 'optionDark'}`} onClick={() => {setSelectedDificulty('EXTREME');setGameStartStatus(true)}}>Extreme</div>
            <div className={`${isDarkMode ? 'option' : 'optionDark'}`} onClick={() => {setSelectedDificulty('INSANE');setGameStartStatus(true)}}>Insane</div>
            {/* <div onClick={() => {setSelectedDificulty('CUSTOM');setGameStartStatus(true)}}>Novice</div> */}
          </div>
        )}
      </div>
      {isGameStarted && <MineGrid isDarkMode={isDarkMode} selectedDificulty={selectedDificulty} />}
    </div>
  );
}