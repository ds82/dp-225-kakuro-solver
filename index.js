#!/usr/bin/env babel-node
//
// karuro solver
// https://www.reddit.com/r/dailyprogrammer/comments/3g2tby/20150807_challenge_226_hard_kakuro_solver/

// input example: [[1,2], [3,"A1","A2"]]
//
//   A
// 1 1
// 2 2
// output: [[1], [2]]

// input example: [[2,3], [13, "A1", "A2", "A3"], [8, "B1", "B2", "B3"], [6, "A1", "B1"], [9, "A3", "B3"]]
//
//  2  3
// 13 A1 A2 A3
//  8 B1 B2 B3
//  6 A1 B1
//  6 A2 B2
//  9 A3 B3
//

import $ld from 'lodash';
import Constraint from './constraint';

try {
  var [[cols, rows], ...data] = JSON.parse(process.argv[2]);
} catch (e) {
  console.log('cannot parse input');
  process.exit(1);
}

var constraints = data.map(Constraint.create);

var solution = $ld.range(0, rows);
solution = solution.map(() => $ld.range(1, cols + 1, 0));

function checkSolution(solution) {
  var oneInvalid = constraints.find((constraint) => !constraint.checkSolution(solution));
  return !oneInvalid;
}

function nextSolution(solution, index = (solution.length - 1)) {
  var entries = solution[index]; // e.g. [1,2,3,4,5]
  var min = Math.min(...entries);

  if (min === 9 && index === 0) { return false; } // no more solutions
  else if (min === 9) {
    solution[index] = $ld.range(1, cols + 1, 0);
    return nextSolution(solution, index - 1);
  }

  // hacky to increase the number ;)
  solution[index] = nextNumber(solution[index]);
  return solution;
}

function hasZero(number) {
  return Math.min(...number) === 0;
}

function nextNumber(number) {
  number = (String(parseInt(number.join(''))+1)).split('').map(v => parseInt(v));
  return hasZero(number) ? nextNumber(number) : number;
}

var check;
while (solution !== false) {
  check = checkSolution(solution);
  if (check) {
    console.log('FOUND SOLUTION');
    console.log(solution);
  }
  solution = nextSolution(solution);
}

console.log('DONE');

