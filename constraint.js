import $ld from 'lodash';

export default class Constraint {
  constructor(raw) {
    [this.sum, ...this.rawEntries] = raw;
    this.entries = this.toCoords(this.rawEntries);
  }

  toCoords(entries) {
    return entries.map(entry => {
      var [col,row] = entry;

      col = col.charCodeAt() - 65;
      row = parseInt(row) - 1;

      return [col,row];
    });
  }

  static create(raw) {
    return new Constraint(raw);
  }

  checkSolution(solution) {
    return this.checkUniqueNumber(solution) && this.checkSum(solution);
  }

  checkUniqueNumber(solution) {
    var s = new Set();
    for(let [col, row] of this.entries) {
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

