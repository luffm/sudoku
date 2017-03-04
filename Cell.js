// -----------------------------------------------------------------------------
// Cell object
// -----------------------------------------------------------------------------

function Cell(s = '') { // String
  this.bits = new Array(9);   // boolean
  this.nextRowElement = null; // Cell
  this.nextColElement = null; // Cell
  this.nextBoxElement = null; // Cell
  this.gridIndex = -1;        // int
  this.rowIndex = -1;         // int
  this.colIndex = -1;         // int
  this.boxIndex = -1;         // int
  this.fixed = false;         // boolean
  this.finalised = false;     // boolean

  this.setBits = function(s) {  // String
    if (s == '') s = "123456789";

    for (var i = 0; i < 9; i++) {
      if (s.includes((i+1).toString())) {
        this.setBit(i);
      } else {
        this.unsetBit(i);
      }
    }
  }

  this.getSetBitIndexArray = function() { // returns array of int
    var arr = [];
    for (var i = 0; i < 9; i++) {
      if (this.isBitSet(i)) arr.push(i);
    }
    return arr;
  }

  this.fixCell = function() {
    this.fixed = true;
  }

  this.unfixCell = function() {
    this.fixed = false;
  }

  this.isFixed = function() { // returns a boolean
    return this.fixed;
  }

  this.finaliseCell = function() {
    this.finalised = true;
  }

  this.unfinaliseCell = function() {
    this.finalised = false;
  }

  this.isFinalised = function() { // returns a boolean
    return this.finalised;
  }

  this.isBitSet = function(i) { // int
    return this.bits[i];
  }

  this.setBit = function(i) { // int
    this.bits[i] = true;
  }

  this.unsetBit = function(i) { // int
    this.bits[i] = false;
  }

  this.setAllBits = function() {
    for (var i = 0; i < 9; i++) {
      this.setBit(i);
    }
  }

  this.unsetAllBits = function() {
    for (var i = 0; i < 9; i++) {
      this.unsetBit(i);
    }
  }

  this.firstSetBit = function() { // returns an int
    var bit;
    for (bit = 0; bit < 9; bit++) {
      if (this.isBitSet(bit)) break;
    }
    if (bit == 9) bit = -1;
    return bit;
  }

  this.getSetBit = function(i) { // returns an int; int
    var bit;
    var count = 0;
    for (bit = 0; bit < 9; bit++) {
      if (this.isBitSet(bit)) {
        count++;
        if (count == i) return bit;
      }
    }
    return -1;
  }

  this.equals = function(cell) { // returns a boolean
    for (var i = 0; i < 9; i++) {
      if (this.isBitSet(i) != cell.isBitSet(i)) return false;
    }
    return true;
  }

  this.toInteger = function() { // returns an int
    var n = 0;
    for (var i = 0; i < 9; i++) {
      if (this.isBitSet(i)) {
        switch (i) {
          case 0: n += 1; break;
          case 1: n += 2; break;
          case 2: n += 4; break;
          case 3: n += 8; break;
          case 4: n += 16; break;
          case 5: n += 32; break;
          case 6: n += 64; break;
          case 7: n += 128; break;
          case 8: n += 256; break;
          default: break;
        }
      }
    }
    return n;
  }

  this.toString = function() { // returns a string
    var s = '';
    for (var i = 0; i < 9; i++) {
      if (this.isBitSet(i)) {
        s += (i+1).toString();
      } else {
        s += "-";
      }
    }
    return s;
  }

  this.count = function() { // returns an int
    var n = 0;
    for (var i = 0; i < 9; i++) {
      if (this.isBitSet(i)) n++;
    }
    return n;
  }

  this.setGridIndex = function(i) { this.gridIndex = i; } // int
  this.setRowIndex = function(i) { this.rowIndex = i; }  // int
  this.setColIndex = function(i) { this.colIndex = i; }  // int
  this.setBoxIndex = function(i) { this.boxIndex = i; }  // int

  this.getGridIndex = function() { return this.gridIndex; } // returns an int
  this.getRowIndex = function() { return this.rowIndex; } // returns an int
  this.getColIndex = function() { return this.colIndex; } // returns an int
  this.getBoxIndex = function() { return this.boxIndex; } // returns an int

  this.getIndex = function(type) { // (int)->int
    switch (type) {
      case R: return this.getRowIndex();
      case C: return this.getColIndex();
      case B: return this.getBoxIndex();
      default: alert("ERROR: getIndex('" + type + "'): no such type.");
    }
    return -1;
  }

  this.next = function(type) { // (int)->Cell
    switch (type) {
      case R: return this.nextRowElement;
      case C: return this.nextColElement;
      case B: return this.nextBoxElement;
      default: alert("ERROR: next('" + type + "'): no such type.");
    }
    return null;
  }

  this.setNext = function(type, cell) { // (int, Cell)->void
    switch (type) {
      case R: this.nextRowElement = cell; break;
      case C: this.nextColElement = cell; break;
      case B: this.nextBoxElement = cell; break;
      default: alert("ERROR: setNext('" + type + "', cell): no such type.");
    }
  }

  // Initialise with s
  this.setBits(s);

}


//var xxcell = new Cell('123');
//alert(xxcell.getSetBitIndexArray());
//var yycell = new Cell();
//xxcell.setNext(R, yycell);
//alert(xxcell.toString() + " " + xxcell.next(R).toString());
