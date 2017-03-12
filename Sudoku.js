// -----------------------------------------------------------------------------
// Sudoku object
// -----------------------------------------------------------------------------

function Sudoku() {
  this.grid = null;       // Grid
  this.selection = -1;    // int
  this.history = [];      // History[]
  this.historyIndex = -1; // int
  this.level = -1;        // int
  this.newLevel = 1;      // int

  this.steps = [];        // Step[]
  this.backup = null;     // History

  this.locked = false;    // boolean
  this.stepping = false;  // boolean
  this.creating = false;  // boolean
  this.quit = false;      // boolean

  this.digitCount = function(s) { // (String)->int
    var count = 0;
    for (var i = 0; i < s.length; i++) {
      if (!isNaN(s.charAt(i))) count++;
    }
    return count;
  }

  this.isSameGroup = function(x, y, type) { // (int, int, int)->boolean
    switch (type) {
      case R: return (Math.floor(x / 9) == Math.floor(y / 9));
      case C: return ((x % 9) == (y % 9));
      case B: return ((Math.floor(x / 27)*3 + Math.floor((x % 9)/3)) == (Math.floor(y / 27)*3 + Math.floor((y % 9)/3)));
      default: return false;
    }
  }

  // ---------------------------------------------------------------------------
  // Draw cell
  // ---------------------------------------------------------------------------

  this.drawCell = function(cell) {
    var index = cell.getGridIndex();
    //alert("drawCell: index=" + index + " cell=" + cell + "sudoku.selection=" + sudoku.selection);

    var id = '' + index;
    id = 'c' + "00".substring(id.length) + id;

    var elem = document.getElementById(id);

    // Background colour
    if (index == this.selection) {
      elem.setAttribute("style", "background-color: yellow;");
    } else if (cell.isFixed()) {
      elem.setAttribute("style", "background-color: #DDDDDD;");
    } else {
      elem.setAttribute("style", "background-color: white;");
    }

    if (cell.count() == 0) {
      elem.innerHTML = '';
    } else if (cell.count() == 1 && cell.isFinalised()) {
      elem.innerHTML = '' + (cell.firstSetBit() + 1);
    } else {
      var bit_html = '<table class="bitcellframe">';
      for (var bit = 0; bit < 9; bit++) {
        // Display set bits
        if (bit % 3 == 0) bit_html += "<tr>";
        bit_html += '<td class="bitcell">';
        if (cell.isBitSet(bit)) {
          bit_html += (bit + 1);
        }
        bit_html += "</td>";
        if (bit % 3 == 2) bit_html += "</tr>";
      }
      bit_html += "</table>";
      elem.innerHTML = bit_html;
    }
  }

  // ---------------------------------------------------------------------------
  // Report validity of grid
  // ---------------------------------------------------------------------------

  this.reportValidity = function() { // (void)->void
    if (this.grid.isValid()) {
      document.getElementById("validity").innerHTML = 'OK';
    } else {
      document.getElementById("validity").innerHTML = "INVALID";
    }
  }

  // ---------------------------------------------------------------------------
  // Report solved grid
  // ---------------------------------------------------------------------------

  this.reportSolvedGrid = function() { // (void)->void
    if (this.grid.isSolved()) {
      document.getElementById("solved").innerHTML = 'Solved!';
    } else {
      document.getElementById("solved").innerHTML = '' + this.grid.solvedCellCount();
    }
  }

  // ---------------------------------------------------------------------------
  // Paint grid
  // ---------------------------------------------------------------------------

  this.paint = function() { // (void)->void
    for (var i = 0; i < 81; i++) {
      var cell = this.grid.getCellRef(i); // Cell
      this.drawCell(cell);
    }
  }

  //----------------------------------------------------------------------------
  // CONVERT LEVEL CODE TO TEXT
  //----------------------------------------------------------------------------

  this.levelToText = function(level) { // (int)->String
    var levelText = '';
    switch (level) {
      case 1: levelText = "Easy"; break;
      case 2: levelText = "Medium"; break;
      case 3: levelText = "Hard"; break;
      case 4: levelText = "Very Hard"; break;
      default: break;
    }
    return levelText;
  }

  //----------------------------------------------------------------------------
  // CARRY OUT STEPS
  //----------------------------------------------------------------------------

  this.doSteps = function() {
    if (this.steps.length > 0) {
      // Restore backup
      this.grid = new Grid(this.backup.numbers);
      for (var i = 0; i < 81; i++) {
        if (this.backup.fixes[i]) this.grid.getCellRef(i).fixCell();
        if (this.backup.finalisations[i]) this.grid.getCellRef(i).finaliseCell();
      }

      this.grid.initialise();

      //this.stepping = false;
      //this.quit = false;
      //alert(this.steps);
      while (this.steps.length > 0) {
        //if (this.stepping) {
          //alert(this.steps[0]);
          for (var act_i = 0; act_i < this.steps[0].actions.length; act_i++) {
            var action = this.steps[0].actions[act_i];
            //alert(action);
            action.execute(this.grid);
          }
          //this.valid = this.grid.isValid();
          this.steps.shift();
          //this.stepping = false;
        //} else if (this.quit) {
        //  alert(this.steps[0]);
        //  for (var act_i = 0; act_i < this.steps[0].actions.length; act_i++) {
        //    var action = this.steps[0].actions[act_i];
        //    action.execute(this.grid);
        //  }
        //  this.valid = this.grid.isValid();
        //  this.steps = [];
        //}
        // ADD A SLEEP FUNCTION HERE!
        //alert("sleep for 50ms")
      }

      this.saveGrid();
    }
  }

  //----------------------------------------------------------------------------
  // ADD A LIST OF STEPS TO MAIN STEPS LIST
  //----------------------------------------------------------------------------

  this.addSteps = function(steps) { // Step[]
    for (var i = 0; i < steps.length; i++) this.steps.push(steps[i]);
  }

  //----------------------------------------------------------------------------
  // SOLVE WITH PATTERN RECOGNITION
  //----------------------------------------------------------------------------

  this.solveAll = function() { // returns an int
    this.addSteps(this.grid.nakedPatterns(1));
    if (this.grid.remaining() == 0) return 0;

    var level = 0;      // int
    var remaining = -1; // int
    var count;          // int
    var found = true;   // boolean
    var loop = true;    // boolean

    while(loop) {
      count = 0;
      found = true;
      while (found) {
        remaining = this.grid.remaining();
        this.addSteps(this.grid.hiddenPatterns(1));
        this.addSteps(this.grid.nakedPatterns(1));
        if (this.grid.remaining() != remaining) {
          count++;
          if (level < 1) level = 1;
        } else {
          found = false;
        }
      }

      count = 0;
      found = true;
      while (found) {
        remaining = this.grid.remaining();
        this.addSteps(this.grid.lockedCandidates1());
        this.addSteps(this.grid.lockedCandidates2());
        this.addSteps(this.grid.hiddenPatterns(2));
        this.addSteps(this.grid.nakedPatterns(2));
        if (this.grid.remaining() != remaining) {
          count++;
          if (level < 2) level = 2;
        } else {
          found = false;
        }
      }

      if (count > 0) continue;

      count = 0;
      found = true;
      while (found) {
        remaining = this.grid.remaining();
        this.addSteps(this.grid.hiddenPatterns(3));
        this.addSteps(this.grid.nakedPatterns(3));
        this.addSteps(this.grid.xFishes(2));
        this.addSteps(this.grid.xyWings());
        if (this.grid.remaining() != remaining) {
          count++;
          if (level < 3) level = 3;
        } else {
          found = false;
        }
      }

      if (count > 0) continue;

      count = 0;
      found = true;
      while (found) {
        remaining = this.grid.remaining();
        this.addSteps(this.grid.hiddenPatterns(4));
        this.addSteps(this.grid.nakedPatterns(4));
        this.addSteps(this.grid.xFishes(3));
        this.addSteps(this.grid.xFishes(4));
        if (this.grid.remaining() != remaining) {
          count++;
          if (level < 4) level = 4;
        } else {
          found = false;
        }
      }

      if (count == 0) loop = false;
    }

    if (this.grid.remaining() == 0) {
      return level;
    } else {
      return -1;
    }
  }

  //----------------------------------------------------------------------------
  // CREATE NEW PUZZLE
  //----------------------------------------------------------------------------

  this.newPuzzle = function() { // returns integer level

    this.grid = new Grid();
    this.level = -1;

    var complete = false;

    var hist = new Array(81); // boolean
    for (var i = 0; i < 81; i++) hist[i] = false;

    while(!complete) {
      //this.saveGrid();
      var backup = new History(this.grid, -1);

      var rand;
      var cell;
      do {
        rand = this.grid.random(81);
        cell = this.grid.getCellRef(rand);
      } while (hist[rand]);                      // || cell.count() != 1
      hist[rand] = true;
      //alert("Rand=" + rand + " Cell=" + cell);
if (cell.count() != 1) alert("Why? " + cell);

      cell.setAllBits();
      //alert("Bits set, Cell=" + cell);

      var count = 0;
      for (var i = 0; i < 81; i++) {
        if (hist[i]) count++;                    //  || this.grid.getCellRef(i).count() != 1
if (!hist[i] && this.grid.getCellRef(i).count() != 1) alert("Why? getCellRef(i)=" + this.grid.getCellRef(i));
      }
      //alert("Count=" + count);

      var level = this.solveAll(); // int
      var solved = this.grid.isSolved(); // boolean
      //alert("Sudoku.newPuzzle():level=" + level + ", grid=" + this.grid + " solved=" + solved);

      if (count == 81) {
        // Complete!
        complete = true;
        this.grid = new Grid(backup.numbers); // restore backup
        if (solved) this.level = level;
      } else if (solved) {
        // Solved but count != 81
        this.grid = new Grid(backup.numbers); // restore backup
        this.grid.getCellRef(rand).setAllBits();
        this.level = level;
      } else {
        // Failed to solved
        this.grid = new Grid(backup.numbers); // restore backup
      }
    }

    this.makeBlanks();
    this.grid.finalise();
    this.grid.fix();

    return this.level;
  }

  //----------------------------------------------------------------------------
  // MAKE BLANK CELLS (FOR CELLS THAT HAVE ALL BITS SET)
  //----------------------------------------------------------------------------

  this.makeBlanks = function() { // (void)->void
    for (var i = 0; i < 81; i++) {
      var cell = this.grid.getCellRef(i); // Cell
      if (cell.count() == 9) cell.unsetAllBits();
    }
  }

  //----------------------------------------------------------------------------
  // SAVE GRID
  //----------------------------------------------------------------------------

  this.saveGrid = function() { // (void)->void
    //alert(this.history.length + " " + this.historyIndex); // 0 -1 , 1 0
    for (var i = this.history.length-1; i > this.historyIndex; i--) this.history.pop();
    this.history.push(new History(this.grid, this.level));
    this.historyIndex++;
    //alert(this.history[this.historyIndex].numbers);
  }

  //----------------------------------------------------------------------------
  // RESTORE GRID
  //----------------------------------------------------------------------------

  this.restoreGrid = function() { // (void)->void
    var h = this.history[this.historyIndex]; // History
    this.grid = new Grid(h.numbers);
    // fix grid
    for (var i = 0; i < 81; i++) {
      if (h.fixes[i]) this.grid.getCellRef(i).fixCell();
      if (h.finalisations[i]) this.grid.getCellRef(i).finaliseCell();
    }
    this.level = h.level;
    //this.valid = this.grid.isValid();
  }

  //----------------------------------------------------------------------------
  // GO TO PREVIOUS GRID
  //----------------------------------------------------------------------------

  this.prevGrid = function() { // (void)->void
    if (this.historyIndex > 0) this.historyIndex--;
    this.restoreGrid();
  }

  //----------------------------------------------------------------------------
  // GO TO NEXT GRID
  //----------------------------------------------------------------------------

  this.nextGrid = function() { // (void)->void
    if (this.historyIndex < this.history.length-1) this.historyIndex++;
    this.restoreGrid();
  }

  //----------------------------------------------------------------------------
  // CLEAR THE GRID OF ALL VALUES
  //----------------------------------------------------------------------------

  this.clearGrid = function() { // (void)->void
    //grid = new Grid(".................................................................................");
    for (var i = 0; i < 81; i++) {
      var cell = this.grid.getCellRef(i); // Cell
      if (!cell.isFixed()) cell.unsetAllBits();
      //cell.unfixCell();
    }
  }


  this.grid = new Grid(".................................................................................");
  //this.grid = new Grid("..53.....8......2..7..1.5..4....53...1..7...6..32...8..6.5....9..4....3......97..");

  this.grid.finalise();
  this.grid.fix();
  //this.valid = this.grid.isValid();
  this.makeBlanks();
  this.saveGrid();
  this.paint();
  this.reportValidity();
  this.reportSolvedGrid();

} // End of Sudoku object
