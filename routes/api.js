'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let params = getParams(req);

      if(!params.puzzle || !params.coordinate || !params.value) {
        console.log(params.puzzle)
        console.log(params.coordinate)
        console.log(params.value)
        console.log('Required field(s) missing')
        res.json({ error: 'Required field(s) missing' });
        return;
      }

      let puzzle = params.puzzle;
      let row = params.coordinate.substring(0, 1);
      let column = params.coordinate.substring(1);
      let value = parseInt(params.value);
      
      console.log(JSON.stringify(params))

      if(!/^[1-9]$/.test(value)) {
        console.log('Invalid value')
        res.json({ error: 'Invalid value' });
        return;
      }

      let puzzleValidation = solver.validate(puzzle);
      if(puzzleValidation.error) {
        console.log(puzzleValidation.error)
        res.json(puzzleValidation);
        return;
      }
      
      let validations = [
        solver.checkRowPlacement(puzzle, row, column, value),
        solver.checkColPlacement(puzzle, row, column, value),
        solver.checkRegionPlacement(puzzle, row, column, value)
      ]
  
      if(validations.some(x => x.error)) {
        let error = validations.find(x => x.error);
        console.log(error)
        res.json(error);
        return;
      }

      if(validations.some(x => x.valid === false)) {
        let result = { valid: false, "conflict": validations.filter(x => x.conflict).map(x => x.conflict) }
        console.log(JSON.stringify(result))
        res.json(result);
        return;
      }

      console.log("ok")
      res.json({ valid: true })
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = getParams(req).puzzle;

      if(!puzzle) {
        res.json({ error: 'Required field missing' });
        return;
      }

      let result = solver.solvePuzzle(puzzle);
      if(result.error) {
        res.json(result);
        return;
      }

      if(result === true) {
        res.json({ solution: solver.getSolution()});
        return;
      } else {
        res.json({ error: 'Puzzle cannot be solved' });
        return;
      }
    });
};

function getParams(req) {
  if(Object.keys(req.body).length > 0) {
    return req.body;
  }

  if(Object.keys(req.query).length > 0) {
    return req.query;
  }

  return {};
}