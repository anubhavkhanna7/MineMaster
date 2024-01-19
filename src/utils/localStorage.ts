interface gameStatus {
  gameTime: string
  gameWon: boolean
}

export const fetchGameStats = () => {
  const defaultStats = {
    'NOVICE': {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      bestTime: '',
      averageTime: '',
      winPercentage: 0
    },
    'EASY': {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      bestTime: '',
      averageTime: '',
      winPercentage: 0
    },
    'MEDIUM': {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      bestTime: '',
      averageTime: '',
      winPercentage: 0
    },
    'HARD': {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      bestTime: '',
      averageTime: '',
      winPercentage: 0
    },
    'EXTREME': {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      bestTime: '',
      averageTime: '',
      winPercentage: 0
    },
    'INSANE': {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      bestTime: '',
      averageTime: '',
      winPercentage: 0
    }
  }

  let stats;
  if (localStorage.getItem('mineMasterStats')) {
    // @ts-ignore
    stats = JSON.parse(localStorage.getItem('mineMasterStats'))
  } else {
    localStorage.setItem('mineMasterStats', JSON.stringify(defaultStats))
    stats = defaultStats;
  }
  return stats;
}

export const findGameStatsForDificulty = (dificultyLevel: string) => {
  const stats = fetchGameStats();
  return stats[dificultyLevel];
}

export const updateGameStats = (dificultyLevel: string, currentGameStats: gameStatus) => {
  const stats = fetchGameStats();
  const currentStats = stats[dificultyLevel];
  currentStats.gamesPlayed++;
  currentGameStats.gameWon ? currentStats.wins ++ : currentStats.losses++;
  currentStats.winPercentage = (currentStats.wins/currentStats.gamesPlayed) * 100;
  currentStats.bestTime = currentGameStats.gameWon ? findSmallerTime(currentStats.bestTime, currentGameStats.gameTime) : currentStats.bestTime;
  currentStats.averageTime = currentGameStats.gameWon ? calculateAvgTime(currentStats.gamesPlayed, currentStats.averageTime, currentGameStats.gameTime) : currentStats.averageTime;

  stats[dificultyLevel] = currentStats;
  localStorage.setItem('mineMasterStats', JSON.stringify(stats))
  return stats[dificultyLevel];
}

const findSmallerTime = (time1: string, time2: string) => {
  if (time1 === '') return time2;
  return calculateSecondCount(time1) > calculateSecondCount(time2) ? time2 : time1;
}

const calculateAvgTime = (gamesPlayed: number, averageTime: string, newTime: string) => {
  if (averageTime === '') return newTime;
  const avgSeconds = calculateSecondCount(averageTime);
  const newSeconds = calculateSecondCount(newTime);
  const newAverageSeconds = gamesPlayed === 1 ? ((avgSeconds * (gamesPlayed)) + newSeconds)/gamesPlayed : ((avgSeconds * (gamesPlayed -1)) + newSeconds)/gamesPlayed;

  const seconds = Math.abs(newAverageSeconds%60);
  const minutes = (Math.floor(newAverageSeconds/60))%60;
  const hours = Math.floor(newAverageSeconds/60) < 60 ? 0 : Math.floor(Math.floor(newAverageSeconds/60)/60);
  return `${hours <= 9 ? `0${hours}` : hours} : ${minutes <= 9 ? `0${minutes}` : minutes} : ${seconds <= 9 ? `0${seconds}` : seconds}`;
}

const calculateSecondCount = (time: string) => {
  const splitTime = time.split(' : ')
  console.log(time, splitTime)
  return parseInt(splitTime[0]) * 3600 + parseInt(splitTime[1]) * 60 + parseInt(splitTime[2])
}