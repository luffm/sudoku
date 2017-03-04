// -----------------------------------------------------------------------------
// Step object
// -----------------------------------------------------------------------------

function Step(name, cells, bits, actions, type) { // String, int[], int[], Action[], char
  this.name    = name;    // String
  this.cells   = cells;   // int[]
  this.bits    = bits;    // int[]
  this.actions = actions; // Action[]
  this.type    = type;    // char

  this.toString = function() { // returns String
    return name + ' ' + cells + ' ' + type;
  }
}
