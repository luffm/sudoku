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
    return "name="+this.name + " cells="+this.cells + " bits="+this.bits + " type="+this.type
           + "\n actions="+this.actions + "\n\n";
  }
}
