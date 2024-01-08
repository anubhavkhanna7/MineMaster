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

  const blinkerTile = (tileList: Array<Number>) => {
    tileList.forEach((tileIndex) => {
      // @ts-ignore
      openedCellsList[tileIndex] !== 1 && document.getElementById(`mine-${tileIndex}`)?.classList.add('blinker');
    })

    setTimeout(() => {
      tileList.forEach((tileIndex: Number) => {
        document.getElementById(`mine-${tileIndex}`)?.classList.remove('blinker')
      })
    }, 1000);
  }

  const bind = useLongPress(() => undefined, {
    onFinish: (event, meta: {context ?:number|undefined}) => {
      event.preventDefault();
      !isBombClicked && onLongClickCell(meta.context || 0);
    },
    onCancel: (event, meta: {context ?:number|undefined}) => {
      // @ts-ignore
      !isBombClicked && event.button !==2 && onClickCell(meta.context || 0);
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
    let updatedOpenedCellList = [...openedCellsList];

    if (generatedGrid[selectedIndex] === -1) {
      setIsBombClicked(true);
      updatedOpenedCellList[selectedIndex] = 1;
      setOpenedCellsList(updatedOpenedCellList)
    } else if (generatedGrid[selectedIndex] === 0) {
      setOpenedCellsList(openSurroundingCells(selectedIndex, updatedOpenedCellList, generatedGrid, mineSize));
    } else if (updatedOpenedCellList[selectedIndex] === 1) {
      let bombClicked = false;
      if (selectedIndex < mineSize) {
        if (selectedIndex === 0) {
          let flagcount = 0;
          updatedOpenedCellList[selectedIndex + 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex + mineSize] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex + mineSize + 1] === -1 && flagcount++;
          if (updatedOpenedCellList[selectedIndex + 1] !== -1 && updatedOpenedCellList[selectedIndex + mineSize] !== -1 && updatedOpenedCellList[selectedIndex + mineSize + 1] !== -1) {
            blinkerTile([selectedIndex + 1, selectedIndex + mineSize, selectedIndex + mineSize + 1]);
          } else if(flagcount === generatedGrid[selectedIndex]) {
            if (updatedOpenedCellList[selectedIndex + 1] !== -1) {
              updatedOpenedCellList[selectedIndex + 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + 1] === 0 ? openSurroundingCells(selectedIndex+1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex + mineSize] !== -1) {
              updatedOpenedCellList[selectedIndex + mineSize] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + mineSize] === 0 ? openSurroundingCells(selectedIndex+mineSize, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + mineSize] === -1;
            }
            if (updatedOpenedCellList[selectedIndex + mineSize + 1] !== -1) {
              updatedOpenedCellList[selectedIndex + mineSize + 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + mineSize + 1] === 0 ? openSurroundingCells(selectedIndex+mineSize+1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + mineSize + 1] === -1;
            }
          }
        } else if (selectedIndex === mineSize-1) {
          let flagcount = 0;
          updatedOpenedCellList[selectedIndex - 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex + mineSize] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex + mineSize - 1] === -1 && flagcount++;
          if (updatedOpenedCellList[selectedIndex - 1] !== -1 && updatedOpenedCellList[selectedIndex + mineSize] !== -1 && updatedOpenedCellList[selectedIndex + mineSize - 1] !== -1) {
            blinkerTile([selectedIndex - 1, selectedIndex + mineSize, selectedIndex + mineSize - 1]);
          } else if(flagcount === generatedGrid[selectedIndex]) {
            if (updatedOpenedCellList[selectedIndex - 1] !== -1) {
              updatedOpenedCellList[selectedIndex - 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - 1] === 0 ? openSurroundingCells(selectedIndex-1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex + mineSize] !== -1) {
              updatedOpenedCellList[selectedIndex + mineSize] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + mineSize] === 0 ? openSurroundingCells(selectedIndex + mineSize, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + mineSize] === -1;
            }
            if (updatedOpenedCellList[selectedIndex + mineSize - 1] !== -1) {
              updatedOpenedCellList[selectedIndex + mineSize - 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + mineSize - 1] === 0 ? openSurroundingCells(selectedIndex + mineSize -1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + mineSize - 1] === -1;
            }
          }
        } else {
          let flagcount = 0;
          updatedOpenedCellList[selectedIndex + 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex + mineSize] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex + mineSize + 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex + mineSize - 1] === -1 && flagcount++;
          if (updatedOpenedCellList[selectedIndex + 1] !== -1
            && updatedOpenedCellList[selectedIndex - 1] !== -1
            && updatedOpenedCellList[selectedIndex + mineSize] !== -1
            && updatedOpenedCellList[selectedIndex + mineSize + 1] !== -1
            && updatedOpenedCellList[selectedIndex + mineSize - 1] !== -1) {
              blinkerTile([selectedIndex + 1, selectedIndex - 1, selectedIndex + mineSize, selectedIndex + mineSize + 1, selectedIndex + mineSize - 1]);
          } else if (flagcount === generatedGrid[selectedIndex]) {
            if (updatedOpenedCellList[selectedIndex + 1] !== -1) {
              updatedOpenedCellList[selectedIndex + 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + 1] === 0 ? openSurroundingCells(selectedIndex + 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - 1] !== -1) {
              updatedOpenedCellList[selectedIndex - 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - 1] === 0 ? openSurroundingCells(selectedIndex - 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex + mineSize] !== -1) {
              updatedOpenedCellList[selectedIndex + mineSize] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + mineSize] === 0 ? openSurroundingCells(selectedIndex + mineSize, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + mineSize] === -1;
            }
            if (updatedOpenedCellList[selectedIndex + mineSize + 1] !== -1) {
              updatedOpenedCellList[selectedIndex + mineSize + 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + mineSize + 1] === 0 ? openSurroundingCells(selectedIndex + mineSize + 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + mineSize + 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex + mineSize - 1] !== -1) {
              updatedOpenedCellList[selectedIndex + mineSize - 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + mineSize - 1] === 0 ? openSurroundingCells(selectedIndex + mineSize - 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + mineSize - 1] === -1;
            }
          }
        }
      } else if (selectedIndex >= (mineSize*(mineSize-1))) {
        if (selectedIndex%mineSize === 0) {
          let flagcount = 0;
          updatedOpenedCellList[selectedIndex + 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - mineSize] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - mineSize + 1] === -1 && flagcount++;
          if (updatedOpenedCellList[selectedIndex + 1] !== -1 && updatedOpenedCellList[selectedIndex - mineSize] !== -1 && updatedOpenedCellList[selectedIndex - mineSize + 1] !== -1) {
            blinkerTile([selectedIndex + 1, selectedIndex - mineSize, selectedIndex - mineSize + 1]);
          } else if (flagcount === generatedGrid[selectedIndex]) {
            if (updatedOpenedCellList[selectedIndex + 1] !== -1) {
              updatedOpenedCellList[selectedIndex + 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + 1] === 0 ? openSurroundingCells(selectedIndex + 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - mineSize] !== -1) {
              updatedOpenedCellList[selectedIndex - mineSize] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - mineSize] === 0 ? openSurroundingCells(selectedIndex - mineSize, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - mineSize] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - mineSize + 1] !== -1) {
              updatedOpenedCellList[selectedIndex - mineSize + 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - mineSize + 1] === 0 ? openSurroundingCells(selectedIndex - mineSize + 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - mineSize + 1] === -1;
            }
          }
        } else if (selectedIndex%mineSize === mineSize-1) {
          let flagcount = 0;
          updatedOpenedCellList[selectedIndex - 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - mineSize] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - mineSize - 1] === -1 && flagcount++;
          if (updatedOpenedCellList[selectedIndex - 1] !== -1 && updatedOpenedCellList[selectedIndex - mineSize] !== -1 && updatedOpenedCellList[selectedIndex - mineSize - 1] !== -1) {
            blinkerTile([selectedIndex - 1, selectedIndex - mineSize, selectedIndex - mineSize - 1]);
          } else if (flagcount === generatedGrid[selectedIndex]) {
            if (updatedOpenedCellList[selectedIndex - 1] !== -1) {
              updatedOpenedCellList[selectedIndex - 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - 1] === 0 ? openSurroundingCells(selectedIndex - 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - mineSize] !== -1) {
              updatedOpenedCellList[selectedIndex - mineSize] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - mineSize] === 0 ? openSurroundingCells(selectedIndex - mineSize, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - mineSize] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - mineSize - 1] !== -1) {
              updatedOpenedCellList[selectedIndex - mineSize - 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - mineSize - 1] === 0 ? openSurroundingCells(selectedIndex - mineSize - 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - mineSize - 1] === -1;
            }
          }
        } else {
          let flagcount = 0;
          updatedOpenedCellList[selectedIndex + 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - mineSize] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - mineSize + 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - mineSize - 1] === -1 && flagcount++;
          if (updatedOpenedCellList[selectedIndex + 1] !== -1
            && updatedOpenedCellList[selectedIndex - 1] !== -1
            && updatedOpenedCellList[selectedIndex - mineSize] !== -1
            && updatedOpenedCellList[selectedIndex - mineSize + 1] !== -1
            && updatedOpenedCellList[selectedIndex - mineSize - 1] !== -1) {
              blinkerTile([selectedIndex + 1, selectedIndex - 1, selectedIndex - mineSize, selectedIndex - mineSize + 1, selectedIndex - mineSize - 1]);
          } else if (flagcount === generatedGrid[selectedIndex]) {
            if (updatedOpenedCellList[selectedIndex + 1] !== -1) {
              updatedOpenedCellList[selectedIndex + 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + 1] === 0 ? openSurroundingCells(selectedIndex + 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - 1] !== -1) {
              updatedOpenedCellList[selectedIndex - 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - 1] === 0 ? openSurroundingCells(selectedIndex - 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - mineSize] !== -1) {
              updatedOpenedCellList[selectedIndex - mineSize] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - mineSize] === 0 ? openSurroundingCells(selectedIndex - mineSize, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - mineSize] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - mineSize + 1] !== -1) {
              updatedOpenedCellList[selectedIndex - mineSize + 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - mineSize + 1] === 0 ? openSurroundingCells(selectedIndex - mineSize + 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - mineSize + 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - mineSize - 1] !== -1) {
              updatedOpenedCellList[selectedIndex - mineSize - 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - mineSize - 1] === 0 ? openSurroundingCells(selectedIndex - mineSize - 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - mineSize - 1] === -1;
            }
          }
        }
      } else {
        if (selectedIndex%mineSize === 0) {
          let flagcount = 0;
          updatedOpenedCellList[selectedIndex + 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - mineSize] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex + mineSize] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - mineSize + 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex + mineSize + 1] === -1 && flagcount++;
          if (updatedOpenedCellList[selectedIndex + 1] !== -1
            && updatedOpenedCellList[selectedIndex + mineSize] !== -1
            && updatedOpenedCellList[selectedIndex + mineSize + 1] !== -1
            && updatedOpenedCellList[selectedIndex - mineSize] !== -1
            && updatedOpenedCellList[selectedIndex - mineSize + 1] !== -1) {
              blinkerTile([selectedIndex + 1, selectedIndex + mineSize, selectedIndex + mineSize + 1, selectedIndex - mineSize, selectedIndex - mineSize + 1]);
          } else if (flagcount === generatedGrid[selectedIndex]) {
            if (updatedOpenedCellList[selectedIndex + 1] !== -1) {
              updatedOpenedCellList[selectedIndex + 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + 1] === 0 ? openSurroundingCells(selectedIndex + 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex + mineSize] !== -1) {
              updatedOpenedCellList[selectedIndex + mineSize] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + mineSize] === 0 ? openSurroundingCells(selectedIndex + mineSize, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + mineSize] === -1;
            }
            if (updatedOpenedCellList[selectedIndex + mineSize + 1] !== -1) {
              updatedOpenedCellList[selectedIndex + mineSize + 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + mineSize + 1] === 0 ? openSurroundingCells(selectedIndex + mineSize + 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + mineSize + 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - mineSize] !== -1) {
              updatedOpenedCellList[selectedIndex - mineSize] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - mineSize] === 0 ? openSurroundingCells(selectedIndex - mineSize, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - mineSize] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - mineSize + 1] !== -1) {
              updatedOpenedCellList[selectedIndex - mineSize + 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - mineSize + 1] === 0 ? openSurroundingCells(selectedIndex - mineSize + 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - mineSize + 1] === -1;
            }
          }
        } else if (selectedIndex%mineSize === mineSize - 1) {
          let flagcount = 0;
          updatedOpenedCellList[selectedIndex - 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex + mineSize] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - mineSize] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex + mineSize - 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - mineSize - 1] === -1 && flagcount++;
          if (updatedOpenedCellList[selectedIndex - 1] !== -1
            && updatedOpenedCellList[selectedIndex + mineSize] !== -1
            && updatedOpenedCellList[selectedIndex + mineSize - 1] !== -1
            && updatedOpenedCellList[selectedIndex - mineSize] !== -1
            && updatedOpenedCellList[selectedIndex - mineSize - 1] !== -1) {
            blinkerTile([selectedIndex - 1, selectedIndex + mineSize, selectedIndex + mineSize - 1, selectedIndex - mineSize, selectedIndex - mineSize - 1]);
          } else if (flagcount === generatedGrid[selectedIndex]) {
            if (updatedOpenedCellList[selectedIndex - 1] !== -1) {
              updatedOpenedCellList[selectedIndex - 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - 1] === 0 ? openSurroundingCells(selectedIndex - 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex + mineSize] !== -1) {
              updatedOpenedCellList[selectedIndex + mineSize] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + mineSize] === 0 ? openSurroundingCells(selectedIndex + mineSize, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + mineSize] === -1;
            }
            if (updatedOpenedCellList[selectedIndex + mineSize - 1] !== -1) {
              updatedOpenedCellList[selectedIndex + mineSize - 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + mineSize - 1] === 0 ? openSurroundingCells(selectedIndex + mineSize - 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + mineSize - 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - mineSize] !== -1) {
              updatedOpenedCellList[selectedIndex - mineSize] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - mineSize] === 0 ? openSurroundingCells(selectedIndex - mineSize, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - mineSize] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - mineSize - 1] !== -1) {
              updatedOpenedCellList[selectedIndex - mineSize - 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - mineSize - 1] === 0 ? openSurroundingCells(selectedIndex - mineSize - 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - mineSize - 1] === -1;
            }
          }
        } else {
          let flagcount = 0;
          updatedOpenedCellList[selectedIndex + 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - mineSize] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex + mineSize] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - mineSize + 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex - mineSize - 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex + mineSize + 1] === -1 && flagcount++;
          updatedOpenedCellList[selectedIndex + mineSize - 1] === -1 && flagcount++;
          if (updatedOpenedCellList[selectedIndex + 1] !== -1
            && updatedOpenedCellList[selectedIndex - 1] !== -1
            && updatedOpenedCellList[selectedIndex + mineSize] !== -1
            && updatedOpenedCellList[selectedIndex - mineSize] !== -1
            && updatedOpenedCellList[selectedIndex + mineSize - 1] !== -1
            && updatedOpenedCellList[selectedIndex - mineSize - 1] !== -1
            && updatedOpenedCellList[selectedIndex + mineSize + 1] !== -1
            && updatedOpenedCellList[selectedIndex - mineSize + 1] !== -1) {
            blinkerTile([selectedIndex + 1, selectedIndex - 1, selectedIndex + mineSize, selectedIndex + mineSize - 1, selectedIndex + mineSize + 1,selectedIndex - mineSize, selectedIndex - mineSize -1, selectedIndex - mineSize + 1]);
          } else if (flagcount === generatedGrid[selectedIndex]) {
            if (updatedOpenedCellList[selectedIndex + 1] !== -1) {
              updatedOpenedCellList[selectedIndex + 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + 1] === 0 ? openSurroundingCells(selectedIndex + 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - 1] !== -1) {
              updatedOpenedCellList[selectedIndex - 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - 1] === 0 ? openSurroundingCells(selectedIndex - 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex + mineSize] !== -1) {
              updatedOpenedCellList[selectedIndex + mineSize] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + mineSize] === 0 ? openSurroundingCells(selectedIndex + mineSize, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + mineSize] === -1;
            }
            if (updatedOpenedCellList[selectedIndex + mineSize - 1] !== -1) {
              updatedOpenedCellList[selectedIndex + mineSize - 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + mineSize - 1] === 0 ? openSurroundingCells(selectedIndex + mineSize - 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + mineSize - 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex + mineSize + 1] !== -1) {
              updatedOpenedCellList[selectedIndex + mineSize + 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex + mineSize + 1] === 0 ? openSurroundingCells(selectedIndex + mineSize + 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex + mineSize + 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - mineSize] !== -1) {
              updatedOpenedCellList[selectedIndex - mineSize] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - mineSize] === 0 ? openSurroundingCells(selectedIndex - mineSize, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - mineSize] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - mineSize - 1] !== -1) {
              updatedOpenedCellList[selectedIndex - mineSize - 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - mineSize - 1] === 0 ? openSurroundingCells(selectedIndex - mineSize - 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - mineSize - 1] === -1;
            }
            if (updatedOpenedCellList[selectedIndex - mineSize + 1] !== -1) {
              updatedOpenedCellList[selectedIndex - mineSize + 1] = 1;
              updatedOpenedCellList = generatedGrid[selectedIndex - mineSize + 1] === 0 ? openSurroundingCells(selectedIndex - mineSize + 1, updatedOpenedCellList, generatedGrid, mineSize) : updatedOpenedCellList;
              bombClicked = bombClicked || generatedGrid[selectedIndex - mineSize + 1] === -1;
            }
          }
        }
      }
      setOpenedCellsList(updatedOpenedCellList);
      setIsBombClicked(bombClicked);
    } else {
      updatedOpenedCellList[selectedIndex] = 1;
      setOpenedCellsList(updatedOpenedCellList);
    }
  }

  const onLongClickCell = (selectedIndex: number) => {
    const updatedOpenedCellList = [...openedCellsList];
    if (updatedOpenedCellList[selectedIndex] !== 1) {
      updatedOpenedCellList[selectedIndex] = updatedOpenedCellList[selectedIndex] === -1 ? 0 : -1;
      setOpenedCellsList(updatedOpenedCellList);
    }
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
        onContextMenu={(e) => {e.preventDefault();!isBombClicked && onLongClickCell(index);}}
        style={isPaused ? unmountedStyle : mountedStyle}
        key={`mine-${index}`}
        id={`mine-${index}`}
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
    <div className='mineGridContainer'>
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
            <span className='gameOverText'>GAME OVER</span>
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