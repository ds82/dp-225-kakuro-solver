import $ld from 'lodash';

export default class Constraint {
  constructor(raw) {
    [this.sum, ...this.rawEntries] = raw;
    this.entries = this.toCoords(this.rawEntries);

    this.cols = this.entries.map(([col, row]) => col);
    this.rows = this.entries.map(([col, row]) => row);

    this.isRowConstraint = Math.min(...this.rows) === Math.max(...this.rows);
  }

  toCoords(entries) {
    return entries.map(([col, row]) => {
      col = col.charCodeAt() - 65;
      row = parseInt(row) - 1;

      return [col,row];
    });
  }

  static create(raw) {
    return new Constraint(raw);
  }

  //
  // calculate a solution that fullfills this constraint
  //
  nextSolution(solution) {
    solution = next.bind(this)();
    while(!this.checkSolution(solution)) {
      solution = next.bind(this)();
    }
    return solution;

    function next() {
      solution = (this.isRowConstraint) ?
        nextRowSolution(this.rows[0], this.cols, solution) :
        nextColumnSolution(this.cols[0], this.rows, solution);
      return solution;
    }
  }


  checkSolution(solution) {
    return this.checkUniqueNumber(solution) && this.checkSum(solution);
  }

  checkUniqueNumber(solution) {
    var s = new Set();
    for (let [col, row] of this.entries) {
      let value = solution[row][col];

      if (s.has(value)) {
        return false;
      }
      s.add(value);
    }
    return true;
  }

  checkSum(solution) {
    var sum = $ld.reduce(this.entries, (total, [col, row]) => {
      return parseInt(total + parseInt(solution[row][col]));
    }, 0);
    return sum === this.sum;
  }
}

function nextRowSolution(row, cols, solution) {
  var rowData = solution[row];
  var start = cols[0];
  var end = cols[cols.length - 1];
  var number = nextNumber(rowData.slice(start, end));

  rowData.splice(start, number.length, ...number);
  solution[row] = rowData;
  return solution;
}

function nextColumnSolution(col, rows, solution) {
  var colData = solution.map(([col, row]) => col);
  var start = rows[0];
  var end = rows[rows.length - 1];
  var number = nextNumber(colData.slice(start, end));

  // re-insert new number into columns of solution
  solution = solution.map(([col, row]) => {
    if (row >= start && row < end) {
      var columnIndex = rows.indexOf(row);
      return [(number[columnIndex]), row];
    }
    return [col, row];
  });

  return solution;
}

function nextNumber(number) {
  number = (String(parseInt(number.join(''))+1)).split('').map(v => parseInt(v));
  return hasZero(number) ? nextNumber(number) : number;
}

function hasZero(number) {
  return Math.min(...number) === 0;
}
