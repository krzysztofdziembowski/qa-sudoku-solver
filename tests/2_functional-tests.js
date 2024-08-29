const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const validString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
const solvedString = "769235418851496372432178956174569283395842761628713549283657194516924837947381625";
const invalidCantSolve = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.413..6.."
const invalidRowPlacement = ".19..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
const invalidColumnPlacement = "..97.5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
const invalidRegionPlacement = "..9.45.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
const invalidLength = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.483..6"
const invalidChars = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6 ."

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test("Solve a puzzle with valid puzzle string: POST request to /api/solve", done => {
    assert.isTrue(true);
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({puzzle: validString})
      .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.equal(solvedString, res.body.solution)
          done();
      });
    });
    test("Solve a puzzle with missing puzzle string: POST request to /api/solve", done => {
    assert.isTrue(true);
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({})
      .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { "error": "Required field missing" })
          done();
      });
    });
    test("Solve a puzzle with invalid characters: POST request to /api/solve", done => {
    assert.isTrue(true);
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({puzzle: invalidChars})
      .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' })
          done();
      });
    });
    test("Solve a puzzle with incorrect length: POST request to /api/solve", done => {
    assert.isTrue(true);
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({puzzle: invalidLength})
      .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' })
          done();
      });
    });
    test("Solve a puzzle that cannot be solved: POST request to /api/solve", done => {
    assert.isTrue(true);
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({puzzle: invalidCantSolve})
      .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' })
          done();
      });
    });
    test("Check a puzzle placement with all fields: POST request to /api/check", done => {
    assert.isTrue(true);
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({puzzle: validString, coordinate: "A1", value: 7})
      .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { valid: true })
          done();
      });
    });
    test("Check a puzzle placement with single placement conflict: POST request to /api/check", done => {
    assert.isTrue(true);
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({puzzle: validString, coordinate: "A1", value: 6})
      .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { valid: false, conflict: [ "column" ] })
          done();
      });
    });
    test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", done => {
    assert.isTrue(true);
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({puzzle: validString, coordinate: "A1", value: 1})
      .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { valid: false, conflict: [ "row", "column" ] })
          done();
      });
    });
    test("Check a puzzle placement with all placement conflicts: POST request to /api/check", done => {
    assert.isTrue(true);
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({puzzle: validString, coordinate: "B3", value: 2})
      .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { valid: false, conflict: [ "row", "column", "region" ] })
          done();
      });
    });
    test("Check a puzzle placement with missing required fields: POST request to /api/check", done => {
    assert.isTrue(true);
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({puzzle: validString})
      .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Required field(s) missing' })
          done();
      });
    });
    test("Check a puzzle placement with invalid characters: POST request to /api/check", done => {
    assert.isTrue(true);
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({puzzle: invalidChars, coordinate: "A1", value: 7})
      .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' })
          done();
      });
    });
    test("Check a puzzle placement with incorrect length: POST request to /api/check", done => {
    assert.isTrue(true);
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({puzzle: invalidLength, coordinate: "A1", value: 7})
      .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' })
          done();
      });
    });
    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", done => {
    assert.isTrue(true);
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({puzzle: validString, coordinate: "AX1", value: 7})
      .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: "Invalid coordinate" })
          done();
      });
    });
    test("Check a puzzle placement with invalid placement value: POST request to /api/check", done => {
    assert.isTrue(true);
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({puzzle: validString, coordinate: "A1", value: 17})
      .end(function (err, res) {
          assert.equal(err, null);
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid value' })
          done();
      });
    });
});

