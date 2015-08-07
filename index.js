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

// generate intital solution
var solution = $ld.range(0, rows);
solution = solution.map(() => $ld.range(1, cols + 1, 0));

function checkSolution(solution) {
  var failedConstraint;
  var oneInvalid = constraints.find((constraint) => {
    var valid = constraint.checkSolution(solution);
    if (!valid) {
      failedConstraint = constraint;
    }
    return !valid;
  });
  return [!oneInvalid, failedConstraint];
}

function nextSolution(solution, failedConstraint = constraints[0]) {
  return failedConstraint.nextSolution(solution);
}

var check, failedConstraint;
while (solution !== false) {
  [check, failedConstraint] = checkSolution(solution);
  if (check) {
    console.log('FOUND SOLUTION');
    console.log(solution);
  }
  solution = nextSolution(solution, failedConstraint);
}

console.log('DONE');

