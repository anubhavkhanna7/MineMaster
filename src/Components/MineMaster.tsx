import { useCallback, useEffect, useState } from 'react';
import MineGrid from './MineGrid/MineGrid';
import './MineMaster.css'
import ViewModeSwitch from './ViewModeSwitch/ViewModeSwitch';

export default function MineMaster() {
  const [isDarkMode, updateDarkModeState] = useState(true);
  const [isGameStarted, setGameStartStatus] = useState(false);

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
        <span className={`title ${isDarkMode ? 'lightTitle' : 'darkTitle'} ${isGameStarted ? 'title-top' : ''}`}>
          Mine Master
        </span>

        {!isGameStarted && (
          <div className='btnContainer'>
            <div onClick={() => setGameStartStatus(true)}>START GAME</div>
            <div>HOW TO PLAY</div>
          </div>
        )}
      </div>
      {isGameStarted && <MineGrid isDarkMode={isDarkMode} />}
    </div>
  );
}