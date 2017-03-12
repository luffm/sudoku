// -----------------------------------------------------------------------------
// Samurai object
// -----------------------------------------------------------------------------

function Samurai() {
  this.grids = [];        // Grid[]
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

  this.drawCell = function(cell, prefix) {
    var index = cell.getGridIndex();
    //alert("drawCell: index=" + index + " cell=" + cell + "sudoku.selection=" + sudoku.selection);

    var id = '' + index;
    id = prefix + "00".substring(id.length) + id;

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
  // Paint grid
  // ---------------------------------------------------------------------------

  this.paint = function() { // (void)->void
    for(var g = 0; g < 5; g++) {
      var grid = this.grids[g];
      var prefix;
      switch (g) {
        case 0: prefix = 'a'; break;
        case 1: prefix = 'b'; break;
        case 2: prefix = 'c'; break;
        case 3: prefix = 'd'; break;
        case 4: prefix = 'e'; break;
        default: break;
      }

      for (var i = 0; i < 81; i++) {
        var cell = grid.getCellRef(i); // Cell
        var boxIndex = cell.getBoxIndex();
        if (prefix != 'c' || (boxIndex != 0 && boxIndex != 2 && boxIndex != 6 && boxIndex != 8)) {
          this.drawCell(cell, prefix);
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
  this.doSteps = function() {
    if (this.steps.length > 0) {
      // Restore backup
      this.grid = new Grid(this.backup.numbers);
      for (var i = 0; i < 81; i++) {
        if (this.backup.fixes[i]) this.grid.getCellRef(i).fixCell();
        if (this.backup.finalisations[i]) this.grid.getCellRef(i).finaliseCell();
      }

      this.grid.initialise();

      while (this.steps.length > 0) {
          for (var act_i = 0; act_i < this.steps[0].actions.length; act_i++) {
            var action = this.steps[0].actions[act_i];
            action.execute(this.grid);
          }
          this.steps.shift();
      }

      this.saveGrid();
    }
  }
*/

  //----------------------------------------------------------------------------
  // CARRY OUT STEPS IN DUPLICATE CELLS
  //----------------------------------------------------------------------------
  var yoyo=true;

  this.duplicateSteps = function(steps) { // Step[]
    if (yoyo) alert(steps);
    for (var i = 0; i < steps.length; i++) {
      var step = steps[i];
    }
  }

  //----------------------------------------------------------------------------
  // SOLVE WITH PATTERN RECOGNITION
  //----------------------------------------------------------------------------

  this.solveAll = function() { // (void)->int
    for (var g = 0; g < 5; g++) {
      if (yoyo) alert(this.grids[g].debug()+"\n\n"+this.grids[2].debug());
      var steps = [];
      this.duplicateSteps(this.grids[g].nakedPatterns(1), g);
      if (yoyo) alert(this.grids[g].debug());
      yoyo=false;
    }


    var remaining = -1; // int
    var count;          // int
    var found = true;   // boolean
    var loop = true;    // boolean


/*
    while (loop) {

      count = 0;
      do {
        found = false;
        for (var g = 0; g < 5; g++) {
          remaining = this.grids[g].remaining();
          this.grids[g].hiddenPatterns(1);
          this.grids[g].nakedPatterns(1);
          this.grids[g].lockedCandidates1();
          this.grids[g].lockedCandidates2();
          this.grids[g].hiddenPatterns(2);
          this.grids[g].nakedPatterns(2);

        //this.addSteps(this.grids[g].hiddenPatterns(3));
        //this.addSteps(this.grids[g].nakedPatterns(3));
        //this.addSteps(this.grids[g].xFishes(2));
        //this.addSteps(this.grids[g].xyWings());
        //this.addSteps(this.grids[g].hiddenPatterns(4));
        //this.addSteps(this.grids[g].nakedPatterns(4));
        //this.addSteps(this.grids[g].xFishes(3));
        //this.addSteps(this.grids[g].xFishes(4));

          if (this.grids[g].remaining() != remaining) {
            count++;
            found = true;
          }
        }
      } while (found);

      if (count == 0) loop = false;
    }
*/

    return 0;

  }


  //----------------------------------------------------------------------------
  // MAKE BLANK CELLS (FOR CELLS THAT HAVE ALL BITS SET)
  //----------------------------------------------------------------------------

  this.makeBlanks = function() { // (void)->void
    for (var g = 0; g < 5; g++) {
      for (var i = 0; i < 81; i++) {
        var cell = this.grids[g].getCellRef(i); // Cell
        if (cell.count() == 9) cell.unsetAllBits();
      }
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






  //----------------------------------------------------------------------------
  // SETUP GRIDS
  //----------------------------------------------------------------------------

  this.grids.push(new Grid());
  this.grids.push(new Grid());
  this.grids.push(new Grid());
  this.grids.push(new Grid());
  this.grids.push(new Grid());

  for (var i = 0; i < 1; i++) this.grids[i].finalise();

  //----------------------------------------------------------------------------
  // CONVERT CORNER GRID NUMBERS TO FIT WITH CENTRE GRID
  //----------------------------------------------------------------------------

  // Loop over corner grids
  for (var i = 0; i < 5; i++) {
    if (i == 2) continue; // excluding centre grid

    var currBox;
    var sourceBox;
    switch (i) {
      case 0: currBox = 8; sourceBox = 0; break;
      case 1: currBox = 6; sourceBox = 2; break;
      case 3: currBox = 2; sourceBox = 6; break;
      case 4: currBox = 0; sourceBox = 8; break;
      default: break;
    }

    var convertArray = []; // int
    var currCell = this.grids[i].boxes[currBox];
    var sourceCell = this.grids[2].boxes[sourceBox];
    for (var bit = 0; bit < 9; bit++) {
      convertArray[currCell.firstSetBit()] = sourceCell.firstSetBit();

      currCell = currCell.next(B);
      sourceCell = sourceCell.next(B);
    }

    //alert(convertArray);

    for (var j = 0; j < 81; j++) {
      currCell = this.grids[i].table[j];
      var bit = currCell.firstSetBit();
      currCell.unsetAllBits();
      currCell.setBit(convertArray[bit]);
    }

  }

  for (var g = 0; g < 3; g+=2) alert("After convert: "+g+"\n"+ this.grids[g].debug());

  // ---------------------------------------------------------------------------
  // SOLVE
  // ---------------------------------------------------------------------------

  var complete = false;

  var hist = []; // boolean[5][81]
  for (var i = 0; i < 5; i++) {
    hist[i] = [];
    for (var j = 0; j < 81; j++) {
      hist[i][j] = false;
    }
  }

  while(!complete) {

    for (var i = 0; i < 5; i++) {

      var count_all = 0;
      for (var g = 0; g < 5; g++) {
        for (var j = 0; j < 81; j++) {
          if (hist[g][j]) count_all++;
        }
      }
      if (count_all == 81*5) {
        complete = true;
        //alert("COMPLETE!! Count=" + count + "/" + count_all);
        break;
      }

      var count = 0;
      for (var j = 0; j < 81; j++) {
        if (hist[i][j]) count++;
      }
      if (count == 81) continue;

      var backup = []; // History[]
      for (var g = 0; g < 5; g++) backup[g] = new History(this.grids[g], -1);

      var rand; // int
      var cell; // Cell
      do {
        rand = this.grids[i].random(81);
        if (yoyo) rand=80;
        cell = this.grids[i].getCellRef(rand);
      } while (hist[i][rand]);

      var dupGridId = -1;    // int - duplicate grid
      var dupCellIndex = -1; // int - duplicate cell index
      // 0 1 2   0 1 2
      // 3 4 5   3 4 5
      // 6 7 8   6 7 8
      //     0 1 2
      //     3 4 5
      //     6 7 8
      // 0 1 2   0 1 2
      // 3 4 5   3 4 5
      // 6 7 8   6 7 8
      if ((i == 0 && cell.boxIndex == 8) || (i == 1 && cell.boxIndex == 6) ||
          (i == 2 && cell.boxIndex == 0 || cell.boxIndex == 2 || cell.boxIndex == 6 || cell.boxIndex == 8) ||
          (i == 3 && cell.boxIndex == 2) || (i == 4 && cell.boxIndex == 0)) {

        var currCell = this.grids[i].firstCellInGroup(B, cell.boxIndex); // Cell

        // 8->0 6->2 2->6 0->8
        if (i == 2) {
          switch (cell.boxIndex) {
            case 0: dupGridId = 0; break;
            case 2: dupGridId = 1; break;
            case 6: dupGridId = 3; break;
            case 8: dupGridId = 4; break;
            default: break;
          }
        } else {
          dupGridId = 2; // Centre grid
        }
        var dupCell = this.grids[dupGridId].firstCellInGroup(B, 8 - cell.boxIndex); // Cell

        for (var j = 0; j < 9; j++) {
          if (cell.gridIndex == currCell.gridIndex) {
            if (yoyo) alert("Found corresponding cells, currCell="+currCell);
            dupCell.setAllBits();
            hist[dupGridId][rand] = true;
            dupCellIndex = dupCell.gridIndex;
          }
          currCell = currCell.next(B);
          dupCell = dupCell.next(B);
        }
      }

      hist[i][rand] = true;

      cell.setAllBits();

      this.solveAll();
      var solved = this.grids[0].isSolved() && this.grids[1].isSolved() &&
                   this.grids[2].isSolved() && this.grids[3].isSolved() &&
                   this.grids[4].isSolved();
      //alert("Count=" + count + "/" + count_all + " Solved=" + solved);

      for (var g = 0; g < 5; g++) this.grids[g] = new Grid(backup[g].numbers);
      if (solved) {
        this.grids[i].getCellRef(rand).setAllBits();
        if (dupCellIndex != -1) this.grids[dupGridId].getCellRef(dupCellIndex).setAllBits();
      }
    }

  }

  this.makeBlanks();
  for (var g = 0; g < 5; g++) this.grids[g].finalise();
  this.paint();

/*
  var final_count = 0;
  for (var g = 0; g < 5; g++) {
    for (var i = 0; i < 81; i++) {
      if (this.grids[g].table[i].finalised) final_count++;
    }
  }
  alert("Finalised cells=" + final_count);
*/

  //for (var g = 0; g < 5; g++) alert(this.grids[g]);

  alert("After solve: "+this.grids[0].debug()+"\n"+ this.grids[2].debug());
  //alert("Centre Grid\n"+this.grids[2].debug());

} // End of Samurai object
