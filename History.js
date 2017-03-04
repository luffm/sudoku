// -----------------------------------------------------------------------------
// History object
// -----------------------------------------------------------------------------

function History(grid, level) { // (Grid, int)
  this.numbers = new Array(81); // String[]
  this.fixes = new Array(81); // boolean[][
  this.finalisations = new Array(81); // boolean[]
  this.level = level; // int

  for (var i = 0; i < 81; i++) {
    this.numbers[i] = grid.getCell(i);
    this.fixes[i] = grid.getCellRef(i).isFixed();
    this.finalisations[i] = grid.getCellRef(i).isFinalised();
  }

  this.equals = function(h) { // (History)->boolean
    if (this.level != h.level) return false;
    for (var i = 0; i < 81; i++) {
      if (this.numbers[i] != h.numbers[i]) return false;
      if (this.fixes[i] != h.fixes[i]) return false;
      if (this.finalisations[i] != h.finalisations[i]) return false;
    }
    return true;
  }
}
