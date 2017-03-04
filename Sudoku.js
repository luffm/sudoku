// -----------------------------------------------------------------------------
// Sudoku object
// -----------------------------------------------------------------------------

function Sudoku() {
  this.grid = null;       // Grid
  this.selection = -1;    // int
  this.history = [];      // History[]
  this.historyIndex = -1; // int
  this.valid = true;      // boolean
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

  this.isSameGroup = function(x, y, type) { // (int, int, char)->boolean
    switch (type) {
      case 'R': return (Math.floor(x / 9) == Math.floor(y / 9));
      case 'C': return ((x % 9) == (y % 9));
      case 'B': return ((Math.floor(x / 27)*3 + Math.floor((x % 9)/3)) == (Math.floor(y / 27)*3 + Math.floor((y % 9)/3)));
      default: return false;
    }
  }

  this.paint = function() { // (void)->void

    for (var i = 0; i < 81; i++) {
      var cell = this.grid.getCell(i); // String
      var cellRef = this.grid.getCellRef(i); // Cell
      var id = '' + i;
      id = "c"+"00".substring(id.length) + id;

      elem = document.getElementById(id);

      if (cellRef.isFixed()) {
        elem.setAttribute("style", "background-color: #DDDDDD;");
      } else {
        elem.setAttribute("style", "background-color: white;");
      }

      if (this.digitCount(cell) == 1 /*&& cellRef.isFinalised()*/) {
        elem.innerHTML = cell.replace(/-/g, '');
      } else if (this.digitCount(cell) == 0) {
        elem.innerHTML = '';
      } else {
        //offscr.setFont(new Font("Dialog", Font.PLAIN, 12));
        //offscr.setColor(Color.blue);
        for (var j = 0; j < cell.length; j++) {
          var ch = cell.charAt(j); // char
        }
      }
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

/*
  private void doSteps() {
    if (steps.size() > 0) {

      // Restore backup
      grid = new Grid(backup.numbers);
      for (int i = 0; i < 81; i++) {
        if (backup.fixes[i]) grid.getCellRef(i).fixCell();
        if (backup.finalisations[i]) grid.getCellRef(i).finaliseCell();
      }

      grid.initialise();

      stepping = false;
      quit = false;
      while (steps.size() > 0) {
        if (stepping) {
          System.out.println(steps.get(0));
          for (Action action : steps.get(0).actions) {
            action.execute(grid);
          }
          valid = grid.isValid();
          steps.remove(0);
          stepping = false;
        } else if (quit) {
          System.out.println(steps.get(0));
          for (Action action : steps.get(0).actions) {
            action.execute(grid);
          }
          valid = grid.isValid();
          steps.clear();
        }
        // ADD A SLEEP FUNCTION HERE!
        Thread t = Thread.currentThread();
        try {
          t.sleep(50);
        } catch (InterruptedException e) {
        }
      }

      saveGrid();
    }
  }
*/

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

/*
        count = 0;
        found = true;
        while (found) {
          remaining = grid.remaining();
          addSteps(grid.hiddenPatterns(3));
          addSteps(grid.nakedPatterns(3));
          addSteps(grid.xFishes(2));
          addSteps(grid.xyWings());
          if (grid.remaining() != remaining) {
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
          remaining = grid.remaining();
          addSteps(grid.hiddenPatterns(4));
          addSteps(grid.nakedPatterns(4));
          addSteps(grid.xFishes(3));
          addSteps(grid.xFishes(4));
          if (grid.remaining() != remaining) {
            count++;
            if (level < 4) level = 4;
          } else {
            found = false;
          }
        }
*/

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

//alert(this.grid);

    while(!complete) {
      this.saveGrid();
      var backup = new History(this.grid, -1);

      var rand;
      var cell;
      do {
        rand = this.grid.random(81);
        cell = this.grid.getCellRef(rand);
      } while (hist[rand] || cell.count() != 1);
      hist[rand] = true;
      //alert("Rand=" + rand + " Cell=" + cell);

      cell.setAllBits();
      //alert("Bits set, Cell=" + cell);

      var count = 0;
      for (var i = 0; i < 81; i++) {
        if (hist[i] || this.grid.getCellRef(i).count() != 1) count++;
      }
      //alert("Count=" + count);

      var level = this.solveAll(); // int
      var solved = this.grid.isSolved(); // boolean

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
    var h = history.get(historyIndex); // History
    this.grid = new Grid(h.numbers);
    // fix grid
    for (var i = 0; i < 81; i++) {
      if (h.fixes[i]) this.grid.getCellRef(i).fixCell();
      if (h.finalisations[i]) this.grid.getCellRef(i).finaliseCell();
    }
    this.level = h.level;
    this.valid = this.grid.isValid();
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
    if (this.historyIndex < this.history.size()-1) this.historyIndex++;
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
  this.valid = this.grid.isValid();
  this.makeBlanks();
  this.saveGrid();
  this.paint();

  for (var i = 0; i < 81; i++) {
    var id = '' + i;
    id = "c"+"00".substring(id.length) + id;

    document.getElementById(id).onclick = function() {
      var id = this.getAttribute("id");
      var elem = document.getElementById(id);
      var selection = parseInt(id.substr(1));

      //alert("prev="+sudoku.selection+" new="+selection);
      if (sudoku.selection == -1) {
        sudoku.selection = selection;
        elem.setAttribute("style", "background-color: #FFFF00;");
      } else if (selection == sudoku.selection) {
        elem.setAttribute("style", "background-color: white;");
        sudoku.selection = -1;
      } else {
        var prev_id = '' + sudoku.selection;
        prev_id = "c"+"00".substring(prev_id.length) + prev_id;
        document.getElementById(prev_id).setAttribute("style", "background-color: white;");

        elem.setAttribute("style", "background-color: #FFFF00;");
        sudoku.selection = selection;
      }
    }
  }


} // End of Sudoku object
