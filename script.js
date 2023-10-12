import { inputData }  from "./data.js";
//import { inputData }  from "./testData.js";  //Data for testing on a smaller sample

let round = 0;
let latestWinningBoard;
const numbers = splitBetweenNumbers(splitByEmptyLine(inputData.boards));
const boards = numbers.map(boardNumbers => CreateBoard(boardNumbers));

const playBingo = (boards) => {
  const draw = inputData.draws[round++]
  
  return boards.filter(board => {
    board = {...board}
    board.numbers.map(numObj => {
      if (numObj.number === draw) { 
        numObj.isDrawn = true 
        numObj.position.forEach(position => board.results[position] += 1) 
      } 
    }) 
    //making bingo value dynamic in case grid size changes
    const result = Object.values(board.results)
    const gridSize = result.length / 2
    board.isBingo = result.some(count => count === gridSize)
    if (!board.isBingo) return board
    if (board.isBingo) latestWinningBoard = board
  })
};

const getScore = (boards) => {
  boards = boards
  do { 
    boards = playBingo(boards) 
  } while(boards.length)
  
  return countTotal(latestWinningBoard)
};

function countTotal (board) {
  const lastDrawPosition = round - 1
  const lastDrawnNumber = inputData.draws.at(lastDrawPosition)
  return lastDrawnNumber * board.numbers.reduce((total, current) => !current.isDrawn ? total + current.number : total , 0) 
};

function CreateBoard(boardNumbers) {
  //added matrix to make the function flexible regardless of the grid's dimensions
  let matrix = Math.sqrt(boardNumbers.length) 
  const createNumberObject = (numbers) => {
    return numbers.map((number, index) => ({ 
      number,
      isDrawn: false,
      position: [`row${Math.floor(index/matrix + 1)}`, `col${(index % matrix + 1)}`] 
    }))    
  }
  return {
    isBingo: false,
    numbers: createNumberObject(boardNumbers),
    results: createResultsTemplate(matrix)
  }
};

function createResultsTemplate(matrix) {
  if (matrix === 0) return {}

  const results = createResultsTemplate(matrix-1)
  results[`row${matrix}`] = 0;
  results[`col${matrix}`] = 0;
  
  return results
};

function splitByEmptyLine(string) {
  return string.split(/\n\s*\n/)
};

function splitBetweenNumbers(grid) {
  return grid.map((string) => {
     return string
      .split(/\s+/)
      .filter(Boolean)
      .map(Number)
  })
};


// Comment out the console to see the result
// console.log(getScore(boards));














