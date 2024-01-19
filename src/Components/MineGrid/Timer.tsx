import { Dispatch, MutableRefObject, SetStateAction, useEffect } from "react";
import './MineGrid.css'
import { convertToTime } from "../../utils/Utilities";

export default function Timer(
    {allMinesIsolated, isBombClicked, isDarkMode, isPaused, setPausedState, onResetClick, timer, setTimer}:
    {
      allMinesIsolated: boolean,
      isBombClicked: boolean,
      isDarkMode: boolean,
      isPaused: boolean,
      setPausedState: Dispatch<SetStateAction<boolean>>,
      onResetClick: () => void,
      timer: number,
      setTimer: Dispatch<SetStateAction<number>>,
    }
  ) {

  const checkTimer = () => {
    let prevTimer = 0;
    setTimer((prev) => {
      prevTimer = prev;
      return prev;
    });
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (!allMinesIsolated && !isPaused && !isBombClicked) { 
        setTimer((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      checkTimer();
      clearInterval(id);
    };
  }, [allMinesIsolated, isBombClicked, isPaused]);

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
        {convertToTime(timer)}
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