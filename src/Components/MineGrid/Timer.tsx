import { Dispatch, SetStateAction, useEffect, useState } from "react";
import './MineGrid.css'

export default function Timer(
    {allMinesIsolated, isBombClicked, isDarkMode, isPaused, setPausedState, onResetClick}:
    {
      allMinesIsolated: boolean,
      isBombClicked: boolean,
      isDarkMode: boolean,
      isPaused: boolean,
      setPausedState: Dispatch<SetStateAction<boolean>>,
      onResetClick: () => void
    }
  ) {
  const [timer, setTimer] = useState(0);

  const checkTimer = () => {
    let prevTimer = 0;
    setTimer((prev) => {
      prevTimer = prev;
      return prev;
    });
  };

  useEffect(() => {
    const id = setInterval(() => {
      !allMinesIsolated && !isPaused && !isBombClicked && setTimer((prev) => prev + 1);
    }, 1000);

    return () => {
      checkTimer();
      clearInterval(id);
    };
  }, [allMinesIsolated, isBombClicked, isPaused]);

  const convertToTime = () => {
    const seconds = Math.abs(timer%60);
    const minutes = (Math.floor(timer/60))%60;
    const hours = Math.floor(timer/60) < 60 ? 0 : Math.floor(Math.floor(timer/60)/60);
    return `${hours <= 9 ? `0${hours}` : hours} : ${minutes <= 9 ? `0${minutes}` : minutes} : ${seconds <= 9 ? `0${seconds}` : seconds}`;
  }

  const returnBtnClass = () => {
    if(isPaused) {
      return `play ${isDarkMode ? 'timer-play-dark' : 'timer-play-light'}`
    }
    return `pause ${isDarkMode ? 'timer-pause-dark' : 'timer-pause-light'}`
  }

  const onResetGame = () => {
    onResetClick();
    setTimer(0);
  }

  return (
    <div className='timerContainer'>
      <div className={`timer ${isDarkMode ? 'timer-dark' : 'timer-light'}`}>
        {convertToTime()}
        {!isBombClicked && (
          <div className={returnBtnClass()} onClick={() => setPausedState(!isPaused)} />
        )}
      </div>
      <div className={`reset ${!isDarkMode && 'reset-light'}`} onClick={onResetGame}>
        <div className={`reset-end ${!isDarkMode && 'reset-end-light'}`} />
      </div>
    </div>
  );
}