const openUpperRowTiles = (selectedIndex: number, updatedOpenedCellList: Array<number>, generatedGrid: Array<number>, mineSize: number) => {
  const updatedIndex = selectedIndex-mineSize;
  if(!updatedOpenedCellList[updatedIndex]) {
    updatedOpenedCellList[updatedIndex] = 1;
    (generatedGrid[updatedIndex] === 0) && (updatedOpenedCellList = openSurroundingCells(updatedIndex, updatedOpenedCellList, generatedGrid, mineSize));
  }
  if ((updatedIndex%mineSize) !== 0 && !updatedOpenedCellList[updatedIndex - 1]) {
    updatedOpenedCellList[updatedIndex - 1] = 1;
    (generatedGrid[updatedIndex - 1] === 0) && (updatedOpenedCellList = openSurroundingCells(updatedIndex - 1, updatedOpenedCellList, generatedGrid, mineSize));
  }
  if (((updatedIndex+1)%mineSize) !== 0 && !updatedOpenedCellList[updatedIndex + 1]) {
    updatedOpenedCellList[updatedIndex + 1] = 1;
    (generatedGrid[updatedIndex + 1] === 0) && (updatedOpenedCellList = openSurroundingCells(updatedIndex + 1, updatedOpenedCellList, generatedGrid, mineSize));
  }
  return updatedOpenedCellList;
}

const openLowerRowTiles = (selectedIndex: number, updatedOpenedCellList: Array<number>, generatedGrid: Array<number>, mineSize: number) => {
  const updatedIndex = selectedIndex+mineSize;
  if(!updatedOpenedCellList[updatedIndex]) {
    updatedOpenedCellList[updatedIndex] = 1;
    (generatedGrid[updatedIndex] === 0) && (updatedOpenedCellList = openSurroundingCells(updatedIndex, updatedOpenedCellList, generatedGrid, mineSize));
  }
  if ((updatedIndex%mineSize) !== 0 && !updatedOpenedCellList[updatedIndex - 1]) {
    updatedOpenedCellList[updatedIndex - 1] = 1;
    (generatedGrid[updatedIndex - 1] === 0) && (updatedOpenedCellList = openSurroundingCells(updatedIndex - 1, updatedOpenedCellList, generatedGrid, mineSize));
  }
  if(((updatedIndex+1)%mineSize) !== 0 && !updatedOpenedCellList[updatedIndex + 1]) {
    updatedOpenedCellList[updatedIndex + 1] = 1;
    (generatedGrid[updatedIndex + 1] === 0) && (updatedOpenedCellList = openSurroundingCells(updatedIndex + 1, updatedOpenedCellList, generatedGrid, mineSize));
  }
  return updatedOpenedCellList;
}

export const openSurroundingCells = (selectedIndex: number, updatedOpenedCellList: Array<number>, generatedGrid: Array<number>, mineSize: number) => {
  updatedOpenedCellList[selectedIndex] = 1;
    const isFirstRow = selectedIndex < (mineSize);
    const isLastRow = selectedIndex >= (mineSize*(mineSize-1));

    // Open tiles below the selected tile
    !isLastRow && (updatedOpenedCellList = openLowerRowTiles(selectedIndex, updatedOpenedCellList, generatedGrid, mineSize));

    // Open tiles above the selected tile
    !isFirstRow && (updatedOpenedCellList = openUpperRowTiles(selectedIndex, updatedOpenedCellList, generatedGrid, mineSize));

    if((selectedIndex%mineSize) !== 0 && !updatedOpenedCellList[selectedIndex - 1]) {
      // Open tiles to the left of selected tile
      updatedOpenedCellList[selectedIndex - 1] = 1;
      (generatedGrid[selectedIndex - 1] === 0) && (updatedOpenedCellList = openSurroundingCells(selectedIndex - 1, updatedOpenedCellList, generatedGrid, mineSize));
    }
    if(((selectedIndex+1)%mineSize) !== 0 && !updatedOpenedCellList[selectedIndex + 1] ) {
      // Open tiles to the right of selected tile
      updatedOpenedCellList[selectedIndex + 1] = 1;
      (generatedGrid[selectedIndex + 1] === 0) && (updatedOpenedCellList = openSurroundingCells(selectedIndex + 1, updatedOpenedCellList, generatedGrid, mineSize));
    }
    return updatedOpenedCellList;
}

export const matchAllOpenedTiles = (openedCellsList: Array<number>, generatedGrid: Array<number>) => {
  let anyNonMineTilesUnopened = false;
  openedCellsList.forEach((openedCell, index) => {
    if (openedCell === 0 && generatedGrid[index] >= 0 ) {
      // Unopened Tile, Tile does not have a mine
      anyNonMineTilesUnopened = true;
    } else if (openedCell === -1 && generatedGrid[index] >= 0) {
      // Flagged Tile, Tile does not have a mine
      anyNonMineTilesUnopened = true;
    } else if (openedCell === 1 && generatedGrid[index] === -1) {
      // Opened Tile, Tile has a mine
      anyNonMineTilesUnopened = true;
    }
  });
  return !anyNonMineTilesUnopened;
}