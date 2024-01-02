import { useCallback, useEffect, useState } from 'react';
import { LongPressEventType, useLongPress } from "use-long-press";
import calculateMatrix from '../../utils/gridGenerator';
import './MineGrid.css'
import { matchAllOpenedTiles, openSurroundingCells } from '../../utils/Utilities';
import Timer from './Timer';

function MineGrid({isDarkMode}: {isDarkMode: boolean}) {
  const mineSize = 9, dificulty = 'EASY';
  const [isBombClicked, setIsBombClicked] = useState(false);
  const [allMinesIsolated, setAllMinesIsolated] = useState(false);
  const [openedCellsList, setOpenedCellsList] = useState(new Array(mineSize*mineSize).fill(0));
  const [generatedGrid, updateGeneratedGrid] = useState(new Array(mineSize*mineSize).fill(0));
  const [isPaused, setPausedState] = useState(false);
  
  useEffect(() => {
    updateGeneratedGrid(calculateMatrix(mineSize, dificulty));
  }, []);

  useEffect(() => {
    (matchAllOpenedTiles(openedCellsList, generatedGrid) && setAllMinesIsolated(true));
  }, [openedCellsList]);

  const bind = useLongPress(() => undefined, {
    onFinish: (event, meta: {context ?:number|undefined}) => {
      !isBombClicked && onLongClickCell(meta.context || 0);
    },
    onCancel: (event, meta: {context ?:number|undefined}) => {
      !isBombClicked && onClickCell(meta.context || 0);
    },
    filterEvents: (event) => true,
    threshold: 500,
    captureEvent: true,
    cancelOnMovement: false,
    cancelOutsideElement: true,
    detect: LongPressEventType.Pointer,
  });
  const handlers = (selectedIndex: number) => bind(selectedIndex);

  const onClickCell = (selectedIndex: number) => {
    const updatedOpenedCellList = [...openedCellsList];

    if (generatedGrid[selectedIndex]) {
      generatedGrid[selectedIndex] === -1 && setIsBombClicked(true);
      updatedOpenedCellList[selectedIndex] = 1;
      setOpenedCellsList(updatedOpenedCellList)
    } else {
      setOpenedCellsList(openSurroundingCells(selectedIndex, updatedOpenedCellList, generatedGrid, mineSize));
    }
  }

  const onLongClickCell = (selectedIndex: number) => {
    const updatedOpenedCellList = [...openedCellsList];
    updatedOpenedCellList[selectedIndex] = updatedOpenedCellList[selectedIndex] === -1 ? 0 : -1;
    setOpenedCellsList(updatedOpenedCellList);
  }

  const flag = (openStatus: number) => (
    <div className='flag'>
      <div className={`base ${openStatus === 0 && 'base-red'}`} />
    </div>
  );

  const returnMineRows = () => {
    return generatedGrid.map((gridValue: number, index: number) => (
      <div
        className={`mineTile  ${isDarkMode ? 'mineDark' : 'mineLight'} ${openedCellsList[index] === -1 && 'flaggedTile'} ${openedCellsList[index] === 1 && 'not-A-Mine'} ${openedCellsList[index] === 1 && gridValue === -1 && 'mine'}`}
        {...handlers(index)}
        style={isPaused ? unmountedStyle : mountedStyle}
      >
        {(openedCellsList[index] && openedCellsList[index] !== -1 && !isPaused) || isBombClicked ? (gridValue === -1 ? flag(openedCellsList[index]) : gridValue) : ''}
      </div>
    ))
  }

  const mountedStyle = {
    animation: "inAnimation 250ms ease-in"
  };
  const unmountedStyle = {
    animation: "outAnimation 270ms ease-out",
    animationFillMode: "forwards"
  };

  const onResetClick = () => {
    setOpenedCellsList(new Array(mineSize*mineSize).fill(0));
    updateGeneratedGrid(calculateMatrix(mineSize, dificulty));
    setIsBombClicked(false);
  }

  return (
    <div>
      <Timer
        allMinesIsolated={allMinesIsolated}
        isBombClicked={isBombClicked}
        isDarkMode={isDarkMode}
        isPaused={isPaused}
        onResetClick={onResetClick}
        setPausedState={setPausedState}
      />
      <div className={`mineContainer ${isDarkMode ? 'dark' : 'light'}`}>
        {returnMineRows()}

        {isBombClicked && (
          <div className={isDarkMode ? 'pausedScreenDark' : 'pausedScreen'} style={mountedStyle} >
            <span className='gameOverText'>Game Over</span>
          </div>
        )}
        {!isBombClicked && allMinesIsolated && (
          <div className={isDarkMode ? 'pausedScreenDark' : 'pausedScreen'} style={mountedStyle} >
            <span className='youWinText'>YOU WIN!</span>
          </div>
        )}
        {isPaused && (
          <div className={isDarkMode ? 'pausedScreenDark' : 'pausedScreen'} style={mountedStyle} >
            <div className='pauseIcon' />
            <span>PAUSED</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default MineGrid;