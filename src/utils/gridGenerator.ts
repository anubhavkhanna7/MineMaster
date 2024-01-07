function createdGridWithMines(totalTiles: number, mineCount: number) {
  let grid = Array(totalTiles).fill(0);
  while (mineCount > 0) {
    let mineTile = Math.floor(Math.random() * (totalTiles));
    if(grid[mineTile] !== -1) {
      grid[mineTile] = -1;
      mineCount--;
    }
  }
  return grid;
}

function fillMineHints(createdGrid: Array<number>, colLength: number) {
  let rowLength = Math.floor(createdGrid.length/colLength);
  for (let rowIndex = 0; rowIndex < rowLength; rowIndex++) {
    for (let colIndex = 0; colIndex<colLength; colIndex++) {
      let sum = 0;
      if(createdGrid[rowIndex*colLength + colIndex] !== -1) {
        if(rowIndex === 0 && colIndex === 0) {
          // first row and first column
          sum+= createdGrid[rowIndex*colLength + colIndex+1] === -1 ? 1 : 0;
          sum+= createdGrid[(rowIndex+1)*colLength + colIndex] === -1 ? 1 : 0;
          sum+= createdGrid[(rowIndex+1)*colLength + colIndex+1] === -1 ? 1 : 0;
        } else if (rowIndex === 0 && colIndex !== colLength-1) {
          // First row and not last column
          sum+= createdGrid[rowIndex*colLength + colIndex-1] ===-1 ? 1 : 0;
          sum+= createdGrid[rowIndex*colLength + colIndex+1] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex+1)*colLength + colIndex-1] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex+1)*colLength + colIndex] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex+1)*colLength + colIndex+1] ===-1 ? 1 : 0;
        } else if (rowIndex === 0 && colIndex === colLength-1) {
          // first row and last column
          sum+= createdGrid[rowIndex*colLength + colIndex-1] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex+1)*colLength + colIndex-1] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex+1)*colLength + colIndex] ===-1 ? 1 : 0;
        } else if (rowIndex !== rowLength-1 && colIndex === 0) {
          // not last row and first column 
          sum+= createdGrid[(rowIndex-1)*colLength + colIndex] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex+1)*colLength + colIndex] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex-1)*colLength + colIndex + 1] ===-1 ? 1 : 0;
          sum+= createdGrid[rowIndex*colLength + colIndex + 1] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex+1)*colLength + colIndex + 1] ===-1 ? 1 : 0;
        } else if (rowIndex === rowLength-1 && colIndex === 0) {
          // last row and first column
          sum+= createdGrid[(rowIndex-1)*colLength + colIndex] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex-1)*colLength + colIndex + 1] ===-1 ? 1 : 0;
          sum+= createdGrid[rowIndex*colLength + colIndex + 1] ===-1 ? 1 : 0;
        } else if (rowIndex !== rowLength-1 && rowIndex !== 0 && colIndex === colLength-1) {
          // Middle rows and last column
          sum+= createdGrid[(rowIndex-1)*colLength + colIndex] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex-1)*colLength + colIndex -1] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex+1)*colLength + colIndex] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex+1)*colLength + colIndex -1] ===-1 ? 1 : 0;
          sum+= createdGrid[rowIndex*colLength + colIndex - 1] ===-1 ? 1 : 0;
        } else {
          sum+= createdGrid[(rowIndex-1)*colLength + colIndex - 1] ===-1 ? 1 : 0;
          sum+= createdGrid[rowIndex*colLength + colIndex - 1] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex+1)*colLength + colIndex - 1] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex-1)*colLength + colIndex] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex+1)*colLength + colIndex] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex-1)*colLength + colIndex + 1] ===-1 ? 1 : 0;
          sum+= createdGrid[rowIndex*colLength + colIndex + 1] ===-1 ? 1 : 0;
          sum+= createdGrid[(rowIndex+1)*colLength + colIndex + 1] ===-1 ? 1 : 0;
        }
        createdGrid[rowIndex*colLength + colIndex] = sum;
      }
    }
  }
  return createdGrid;
}

export default function calculateMatrix(size = 9, dificulty = 'EASY', customMines = 0) {
  let totalTiles = size * size;
  let countOfMines = 0;
  switch (dificulty) {
    case 'NOVICE':
      countOfMines = (totalTiles*10)/100;
      break;
    case 'EASY':
      countOfMines = (totalTiles*15)/100;
      break;
    case 'MEDIUM':
      countOfMines = (totalTiles*20)/100;
      break;
    case 'HARD':
      countOfMines = (totalTiles*25)/100;
      break;
    case 'EXTREME':
      countOfMines = (totalTiles*30)/100;
      break;
    case 'INSANE':
      countOfMines = (totalTiles*35)/100;
      break;
    case 'CUSTOM':
      countOfMines = customMines;
      break;
  }
  return fillMineHints(createdGridWithMines(totalTiles, countOfMines), size);
}