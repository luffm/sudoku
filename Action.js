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

  this.toString = function() { // returns String
    var cmd;
    switch (this.command) {
      case SETBIT:       cmd = "SETBIT"; break;
      case UNSETBIT:     cmd = "UNSETBIT"; break;
      case SETALLBITS:   cmd = "SETALLBITS"; break;
      case UNSETALLBITS: cmd = "UNSETALLBITS"; break;
      default: break;
    }
    return "Action: index=" + this.index + " command=" + cmd + " bit=" + this.bit;
  }
}
