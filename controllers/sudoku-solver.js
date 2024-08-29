class SudokuSolver {
  constructor() {
    this.board = [];
  }

  validate(puzzleString) {
    if(puzzleString == null || puzzleString == undefined) {
      return { error: 'Required field missing' };
    }
    if(puzzleString.length != 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    if(/[^1-9.]/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    if(!/^[A-I]$/.test(row) || !/^[1-9]$/.test(column.toString())) {
      return { error: "Invalid coordinate" };
    }
    
    let x = row.charCodeAt(0) - 65;
    let y = parseInt(column) - 1;

    for (let i = 0; i < 9; i++) {
      let char = puzzleString[x * 9 + i];
      if (parseInt(char) == value && i != y) {
        return { valid: false, "conflict": "row" };
      }
    }

    return { valid: true };
  }

  checkColPlacement(puzzleString, row, column, value) {
    if(!/^[A-I]$/.test(row) || !/^[1-9]$/.test(column.toString())) {
      return { error: "Invalid coordinate" };
    }
    
    let x = row.charCodeAt(0) - 65;
    let y = parseInt(column) - 1;

    for (let i = 0; i < 9; i++) {
      if (parseInt(puzzleString[i * 9 + y]) === value && i !== x) {
        return { valid: false, "conflict": "column" };
      }
    }

    return { valid: true };
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    if(!/^[A-I]$/.test(row) || !/^[1-9]$/.test(column.toString())) {
      return { error: "Invalid coordinate" };
    }
    
    let x = row.charCodeAt(0) - 65;
    let y = parseInt(column) - 1;

    const boxRow = Math.floor(x / 3) * 3;
    const boxCol = Math.floor(y / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (parseInt(puzzleString[(boxRow + i) * 9 + (boxCol + j)]) == value && (boxRow + i != x || boxCol + j != y)) {
          return { valid: false, "conflict": "region" };   
        }
      }
    }

    return { valid: true };
  }

  isValid(puzzleString, position, value) {
    let row = String.fromCharCode(65 + position / 9);
    let column = position % 9 + 1;
    let rowValid = this.checkRowPlacement(puzzleString, row, column, value);
    let columnValid = this.checkColPlacement(puzzleString, row, column, value);
    let regionValid = this.checkRegionPlacement(puzzleString, row, column, value);

    if(!rowValid.valid || !columnValid.valid || !regionValid.valid) {
      return false;
    }

    return true;
  }

  solvePuzzle(puzzle) {
    let validationResult = this.validate(puzzle);
    if (validationResult !== true) {
      return validationResult;
    }

    this.board = puzzle.split('').map(char => char === '.' ? 0 : parseInt(char));
    return this.solve(0);
  }

  solve(position) {
    if(position === 81) return true;
    if(this.board[position] !== 0) return this.solve(position + 1);

    for(let i = 1; i <= 9; i++) {
      if(this.isValid(this.board, position, i)) {
        this.board[position] = i;
        if(this.solve(position + 1)) return true;
        this.board[position] = 0;
      }
    }

    return false;
  }

  getSolution() {
    return this.board.join('');
  }
}

module.exports = SudokuSolver;

