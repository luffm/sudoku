// -----------------------------------------------------------------------------
// Action object
// -----------------------------------------------------------------------------

function Action(index, command, bit) { // (int, int, int)
  this.index = index;
  this.command = command;
  this.bit = bit;

  this.execute = function(grid) { // (Grid)->void
    var cell = grid.getCellRef(this.index); // Cell
    switch (this.command) {
      case SETBIT:       cell.setBit(bit); break;
      case UNSETBIT:     cell.unsetBit(bit); break;
      case SETALLBITS:   cell.setAllBits(); break;
      case UNSETALLBITS: cell.unsetAllBits(); break;
      default: break;
    }
    if (cell.count() == 1) {
      cell.finaliseCell();
    } else {
      cell.unfinaliseCell();
    }
  }
}
