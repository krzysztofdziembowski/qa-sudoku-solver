const chai = require('chai');
const assert = chai.assert;

const validString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
const invalidCantSolve = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.413..6.."
const invalidRowPlacement = ".19..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
const invalidColumnPlacement = "..97.5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
const invalidRegionPlacement = "..9.45.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
const invalidLength = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.483..6"
const invalidChars = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6 ."

const Solver = require('../controllers/sudoku-solver.js');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
let solver;

suite('Unit Tests', () => {
    test("Logic handles a valid puzzle string of 81 characters", () => {
        solver = new Solver();
        let result = solver.validate(validString);
        assert.equal(result, true);
    })
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
        solver = new Solver();
        let result = solver.validate(invalidChars);
        assert.equal(result.error, "Invalid characters in puzzle");
    })
    test("Logic handles a puzzle string that is not 81 characters in length", () => {
        solver = new Solver();
        let result = solver.validate(invalidLength);
        assert.equal(result.error, "Expected puzzle to be 81 characters long");
    })
    test("Logic handles a valid row placement", () => {
        solver = new Solver();
        let result = solver.checkRowPlacement(validString, "B", 3, 1)
        assert.equal(result.valid, true);
    })
    test("Logic handles an invalid row placement", () => {
        solver = new Solver();
        let result = solver.checkRowPlacement(validString, "A", 1, 1)
        assert.equal(result.valid, false);
        assert.include(result.conflict, 'row');
    })
    test("Logic handles a valid column placement", () => {
        solver = new Solver();
        let result = solver.checkColPlacement(validString, "B", 3, 1)
        assert.equal(result.valid, true);
    })
    test("Logic handles an invalid column placement", () => {
        solver = new Solver();
        let result = solver.checkColPlacement(validString, "A", 4, 7)
        assert.equal(result.valid, false);
        assert.include(result.conflict, 'column');
    })
    test("Logic handles a valid region (3x3 grid) placement", () => {
        solver = new Solver();
        let result = solver.checkRegionPlacement(validString, "B", 3, 1)
        assert.equal(result.valid, true);
    })
    test("Logic handles an invalid region (3x3 grid) placement", () => {
        solver = new Solver();
        let result = solver.checkRegionPlacement(validString, "B", 3, 2)
        assert.equal(result.valid, false);
        assert.include(result.conflict, 'region');
    })
    test("Valid puzzle strings pass the solver", () => {
        solver = new Solver();
        for(let i = 0; i < puzzlesAndSolutions.length; i++) {
            assert.isTrue(solver.solvePuzzle(puzzlesAndSolutions[i][0]));
        }
    })
    test("Invalid puzzle strings fail the solver", () => {
        solver = new Solver();
        let result = solver.solvePuzzle(invalidCantSolve);
        assert.isFalse(result);
    })
    test("Solver returns the expected solution for an incomplete puzzle", () => {
        solver = new Solver();
        for(let i = 0; i < puzzlesAndSolutions.length; i++) {
            let result = solver.solvePuzzle(puzzlesAndSolutions[i][0]);
            assert.isTrue(result);
            assert.equal(solver.getSolution(), puzzlesAndSolutions[i][1]);
        }
    })
});
