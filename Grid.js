// -----------------------------------------------------------------------------
// Grid object
// -----------------------------------------------------------------------------

function Grid(s) { 
  this.table = new Array(81); // Cell[]
  this.rows  = new Array(9);  // Cell[]
  this.cols  = new Array(9);  // Cell[]
  this.boxes = new Array(9);  // Cell[]

  this.invalid = false; // boolean

  this.definedGrid = function(s) { // String e.g. s = "25..16...4..5.........8..9..2..5.1.....493.......6..7..9..7.........5..21..64..38"
    if (s.length != 81) {
      alert("ERROR: initialisation string, for grid is not length 81 (" + s.length + ")");
      return;
    }

    var arr = new Array(81); // String[]

    for (var i = 0; i < 81; i++) {
      var ch = s.charAt(i);
      if (!isNaN(ch)) {
        arr[i] = ch;
      } else {
        arr[i] = '';
      }
    }
    this.setup(arr);
  }

  this.arrayGrid = function(arr) { // String[] e.g. s = {"", "", "5", "3", "", ..., "46", "129"}
    if (arr.length != 81) return;
    this.setup(arr);
  }

  this.random = function(i) {
    return Math.floor(Math.random() * i);
  }

  this.rowValid = function(grid, row) { // returns boolean; String[], int
    var arr = [false, false, false, false, false, false, false, false, false];
    var isValid = true; // boolean
    for (var c = 0; c < 9; c++) {
      var v = grid[(row * 9) + c]; // String
      if (v != '') {
        if (arr[parseInt(v)-1]) {
          isValid = false;
        } else {
          arr[parseInt(v)-1] = true;
        }
      }
    }
    return isValid;
  }

  this.colValid = function(grid, col) { // returns boolean; String[], int
    var arr = [false, false, false, false, false, false, false, false, false];
    var isValid = true; // boolean
    for (var r = 0; r < 9; r++) {
      var v = grid[(r * 9) + col]; // String
      if (v != '') {
        if (arr[parseInt(v)-1]) {
          isValid = false;
        } else {
          arr[parseInt(v)-1] = true;
        }
      }
    }
    return isValid;
  }

  this.boxValid = function(grid, row, col) { // returns boolean; String[], int, int
    var arr = [false, false, false, false, false, false, false, false, false];
    var isValid = true; // boolean
    var i = Math.floor(row / 3) * 27 + Math.floor(col / 3) * 3; // int
    for (var j = 0; j < 3; j++) {
      for (var c = i; c < i + 3; c++) {
        var v = grid[c]; // String
        if (v != '') {
          if (arr[parseInt(v)-1]) {
            isValid = false;
          } else {
            arr[parseInt(v)-1] = true;
          }
        }
      }
      i += 9;
    }
    return isValid;
  }


  this.randomGrid = function() { // Create new random grid
    hist = new Array(81); // boolean[81][9]
    for (var i = 0; i < 81; i++) {
      hist[i] = new Array(9);
    }
    arr = new Array(81); // String[81]

    for (var i = 0; i < 81; i++) {
      arr[i] = '';
      for (var val = 0; val < 9; val++) {
        hist[i][val] = false;
      }
    }

    for (var i = 0; i < 81; i++) {
      var row = Math.floor(i / 9); // int
      var col = i % 9;             // int
      //var rand = this.random(9);   // int
      var v = this.random(9);    // int
      var isFound = false;         // boolean
      for (var j = 0; j < 9; j++) {
        if (!hist[i][v]) {
          arr[i] = (v+1).toString();
          if (this.rowValid(arr, row) && this.colValid(arr, col) && this.boxValid(arr, row, col)) {
            hist[i][v] = true;
            isFound = true;
            break;
          }
        }
        v = (v + 1) % 9;
      }
      if (!isFound) {
        //alert("("+row+","+col+") not found");
        for (var val = 0; val < 9; val++) hist[i][val] = false;
        arr[i] = '';
        i -= 2;
      }
    }

    this.setup(arr);

  }





  this.setup = function(s) { // String[], e.g. s = ["", "", "5", "3", "", ..., "46", "129"]

    // Set up cells, row links and table array
    for (var r = 0; r < 9; r++) {
      this.rows[r] = new Cell(s[r*9]);
      this.table[r*9] = this.rows[r];
      var cell = this.rows[r]; // Cell
      for (var c = 1; c < 9; c++) {
        cell.setNext(R, new Cell(s[r*9 + c]));
        cell = cell.next(R);
        this.table[r*9 + c] = cell;
      }
    }

    // Set up column links
    for (var c = 0; c < 9; c++) {
      this.cols[c] = this.table[c];
      var cell = this.cols[c];
      for (var r = 1; r < 9; r++) {
        cell.setNext(C, this.table[r*9 + c]);
        cell = cell.next(C);
      }
    }

    // Set up box links
    for (var b = 0; b < 9; b++) {
      var offset = Math.floor(b / 3)*27 + (b % 3)*3; // int
      //alert("b:" + b + " Offset:" + offset)
      this.boxes[b] = this.table[offset];
      var cell = this.boxes[b];
      for (var i = 1; i < 9; i++) {
        cell.setNext(B, this.table[offset + Math.floor(i / 3)*9 + (i % 3)]);
        cell = cell.next(B);
      }
    }

    // Set indexes
    for (var i = 0; i < 81; i++) {
      var cell = this.table[i];
      cell.setGridIndex(i);
      cell.setRowIndex(Math.floor(i / 9));
      cell.setColIndex(i % 9);
      cell.setBoxIndex(Math.floor(i / 27)*3 + Math.floor((i % 9) / 3));
    }

  }

  this.getCell = function(i) { // int; returns a string
    return this.table[i].toString();
  }

  this.getCellRef = function(i) { // int; returns a Cell
    return this.table[i];
  }

  this.toString = function() { // returns a string
    var s = '';
    for (var r = 0; r < 9; r++) {
      var cell = this.rows[r];
      for (var c = 0; c < 9; c++) {
        s += "[" + cell.toString() + "]";
        cell = cell.next(R);
      }
      s += "\n";
    }
    return s;
  }

  this.factorial = function(x) { // returns an int; int
    var fac = 1;
    while (x > 1) {
      fac *= x;
      x--;
    }
    return fac;
  }

  this.firstCellInGroup = function(type, i) { // (int, int)->Cell
    switch (type) {
      case R: return this.rows[i];
      case C: return this.cols[i];
      case B: return this.boxes[i];
      default: return null;
    }
  }

  //----------------------------------------------------------------------------
  // NAKED PATTERNS
  //----------------------------------------------------------------------------

  this.nakedPattern = function(x, index, steps) { // (int, int, Step[])->void
    var cell = this.table[index]; // Cell
    if (cell.count() != x) return;

    var bits = []; // int[]
    for (var bit = 0; bit < 9; bit++) {
      if (cell.isBitSet(bit)) bits.push(bit);
    }

    // For row group, column group and box group...
    for (var type = 0; type < 3; type++) { // char
//alert("POINT: nakedPattern x="+x+" index="+index+" type="+type+" bits="+bits);
      var actions = []; // Action[]
      var cells = []; // int[]

      // Look for occurrences of naked pattern in all cells of group
      var found = 0; // int
      var currCell = this.firstCellInGroup(type, cell.getIndex(type)); // Cell
      for (var j = 0; j < 9; j++) {
        var curr = currCell.getGridIndex(); // int
        if (currCell.equals(cell)) {
          found++;
          cells.push(curr);
        }
        currCell = currCell.next(type);
      }
//alert("POINT: cells found="+cells);

      // If naked pattern found, search and eliminate bits from other cells
      if (found == x) {
//System.out.println("POINT: naked pattern found");
        var elimination = false; // boolean
        currCell = this.firstCellInGroup(type, cell.getIndex(type));
        for (var j = 0; j < 9; j++) {
          var curr = currCell.getGridIndex(); // int
          if (cells.indexOf(curr) == -1) {
//alert("POINT:   cells does not contain curr (OK), currCell="+currCell.toInteger()+" cell="+cell.toInteger()+" => "+(currCell.toInteger() & cell.toInteger()));
            if ((currCell.toInteger() & cell.toInteger()) > 0) {
              elimination = true;
              for (var bit = 0; bit < 9; bit++) {
                if (cell.isBitSet(bit) && currCell.isBitSet(bit)) {
                  currCell.unsetBit(bit);
                  actions.push(new Action(curr, UNSETBIT, bit));
                }
              }
            }
          }
          currCell = currCell.next(type);
        }

        if (elimination) {
          var name = ''; // String
          switch (x) {
            case 1: name = "Naked Single"; break;
            case 2: name = "Naked Pair"; break;
            case 3: name = "Naked Triple"; break;
            case 4: name = "Naked Quad"; break;
            default: break;
          }
          steps.push(new Step(name, cells, bits, actions, type));
          //alert(new Step("Naked Pair", cells, actions, type));
          //alert("(r" + (cell.getRowIndex()+1) + ",c" + (cell.getColIndex()+1) + "): " +
          //                   "Naked pair " + (b1+1) + (b2+1) + " [" + type + "]");
        }
      } else if (found > x) {
        // Found too many naked patterns
        invalid = true;
      }
    }
  }

  this.nakedPatterns = function(x) { // (int)->Step[]
    //alert("Grid.nakedPatterns called!");
    var steps = []; // Step[]

    for (var i = 0; i < 81; i++) {
      this.nakedPattern(x, i, steps);
    }

    return steps;
  }

  //----------------------------------------------------------------------------
  // HIDDEN PATTERNS
  //----------------------------------------------------------------------------

  this.hiddenPattern = function(x, index, steps) { // (int, int, Step[])->void
    var cell = this.table[index]; // Cell
    if (cell.count() == 1) return;

    // For row group, column group and box group...
    for (var type = 0; type < 3; type++) { // char
      //alert(index + " " + type + " " + cell);

      // Set bits in array, arr, for all occurring bits in group cells that have >=2 bits set
      var arr = [false, false, false, false, false, false, false, false, false]; // boolean[]
      var currCell = this.firstCellInGroup(type, cell.getIndex(type)); // Cell
      for (var i = 0; i < 9; i++) {
        if (currCell.count() > 1) {
          for (var bit = 0; bit < 9; bit++) arr[bit] = arr[bit] || currCell.isBitSet(bit);
        }
        currCell = currCell.next(type);
      }

//alert("arr: ");for (var i=0; i<9; i++) alert(arr[i]+" ");

      // Combinations of x bits
      var combos = []; // int[][]
      for (var b1 = 0; b1 < 9-x+1; b1++) {

        if (!arr[b1]) continue;
        if (x == 1) {
          if (cell.isBitSet(b1)) {
            var combo = []; // int[]
            combo.push(b1);
            combos.push(combo);
          }
          continue;
        }

        for (var b2 = b1+1; b2 < 9-x+2; b2++) {
          if (!arr[b2]) continue;
          if (x == 2) {
            if (cell.isBitSet(b1) || cell.isBitSet(b2)) {
              var combo = []; // int[]
              combo.push(b1);
              combo.push(b2);
              combos.push(combo);
            }
            continue;
          }

          for (var b3 = b2+1; b3 < 9-x+3; b3++) {
            if (!arr[b3]) continue;
            if (x == 3) {
              if (cell.isBitSet(b1) || cell.isBitSet(b2) || cell.isBitSet(b3)) {
                var combo = []; // int[]
                combo.push(b1);
                combo.push(b2);
                combo.push(b3);
                combos.push(combo);
              }
              continue;
            }

            for (var b4 = b3+1; b4 < 9; b4++) {  // x==4
              if (!arr[b4]) continue;
              if (x == 4) {
                if (cell.isBitSet(b1) || cell.isBitSet(b2) || cell.isBitSet(b3) || cell.isBitSet(b4)) {
                  var combo = []; // int[]
                  combo.push(b1);
                  combo.push(b2);
                  combo.push(b3);
                  combo.push(b4);
                  combos.push(combo);
                }
                continue;
              }
            }
          }
        }
      }

//for(var zz=0; zz < combos.length; zz++) {
//alert("ZZcombo: ");for (var i=0; i<x; i++) alert(combos[zz][i]+" ");
//}

      out: {
        for (var ci = 0; ci < combos.length; ci++) {
          var combo = combos[ci];
//System.out.print("combo: ");for (int i=0; i<combo.length; i++) System.out.print(combo[i]+" ");System.out.println();
          var counts = []; // int[]
          var cells = []; // int[]

          currCell = this.firstCellInGroup(type, cell.getIndex(type));
          for (var i = 0; i < 9; i++) {
            var isBitSet = false; // boolean
            for (var j = 0; j < x; j++) {
              if (currCell.isBitSet(combo[j])) {
                counts[j]++;
                isBitSet = true;
              }
            }
            if (isBitSet) cells.push(currCell.getGridIndex());
            currCell = currCell.next(type);
          }
//System.out.print("counts:: ");for (int i=0; i<x; i++) System.out.print(i+":"+counts[i]+" ");System.out.println();
//System.out.println("cells: "+cells);

          var inRange = true; // boolean
          for (var j = 0; j < x; j++) {
            if (counts[j] < 1 || counts[j] > x) inRange = false;
          }

          if (inRange && cells.length == x) {
//alert("Found!: 1 <= counts[*] <= "+x);
            var actions = []; // Action[]
            var found = false; // boolean
            for (var curr_i = 0; curr_i < cells.length; curr_i++) {
              var curr = cells[curr_i]; // int
              currCell = this.table[curr];

              for (var bit = 0; bit < 9; bit++) {
                var hiddenBit = false; // boolean
                for (var j = 0; j < x; j++) {
                  if (bit == combo[j]) hiddenBit = true;
                }

                if (currCell.isBitSet(bit) && !hiddenBit) {
                  found = true;
                  currCell.unsetBit(bit);
                  actions.push(new Action(curr, UNSETBIT, bit));
                }
              }
            }

            if (found) {
              var name = ''; // String
              switch (x) {
                case 1: name = "Hidden Single"; break;
                case 2: name = "Hidden Pair"; break;
                case 3: name = "Hidden Triple"; break;
                case 4: name = "Hidden Quad"; break;
                default: break;
              }

              var bits = []; // int[]
              for (var j = 0; j < x; j++) bits.push(combo[j]);

              steps.push(new Step(name, cells, bits, actions, type));
            }
            break out; // we are done for this group
          }
        }
      }
    } // end of group loop
  }

  this.hiddenPatterns = function(x) { // (int)->Step[]
    //alert("Grid.nakedPatterns called!");
    var steps = []; // Step[]

    for (var i = 0; i < 81; i++) {
      this.hiddenPattern(x, i, steps);
    }

    return steps;
  }

  //----------------------------------------------------------------------------
  // LOCKED CANDIDATES 1
  //----------------------------------------------------------------------------
  
  this.lockedCandidate1 = function(index, steps) { // (int, Step[])->void
    var cell = this.table[index]; // Cell
    if (cell.count() == 1) return;
  
    // For rows and columns...
    for (var type = 0; type < 2; type++) {
  
      var setBits = cell.getSetBitIndexArray(); // int[]
      for (var bit_i = 0; bit_i < setBits.length; bit_i++) {
        var bit = setBits[bit_i] // int
  
        var count = 0; // int
        var currCell = this.firstCellInGroup(B, cell.getBoxIndex()); // Cell
        for (var i = 0; i < 9; i++) {
          if (currCell.getIndex(type) != cell.getIndex(type) && currCell.isBitSet(bit)) count++;
          currCell = currCell.next(B);
        }
  
        if (count == 0) {
          // Eliminate bit from outer sections of row/column related to cell
  
          var actions = []; // Action[]
          var found = false; // boolean
          currCell = this.firstCellInGroup(type, cell.getIndex(type));
          for (var i = 0; i < 9; i++) {
            if (currCell.getIndex(B) != cell.getIndex(B) && currCell.isBitSet(bit)) {
              found = true;
              currCell.unsetBit(bit);
              actions.push(new Action(currCell.getGridIndex(), UNSETBIT, bit));
            }
            currCell = currCell.next(type);
          }
  
          if (found) {
            var cells = []; // int[]
            cells.push(index);
  
            var bits = []; // int[]
            bits.push(bit);
  
            steps.push(new Step("Locked candidate type-1", cells, bits, actions, type));
            //alert("(r" + (cell.getRowIndex()+1) + ",c" +
            //             (cell.getColIndex()+1) + "): " +
            //             "Locked candidate (type-1) " +
            //             (bit+1) +
            //             " in " + cell + " [" + type + "]");
          }
        }
  
      } // End of bits loop
    } // End of type loop
  
  }
  
  this.lockedCandidates1 = function() { // void->Step[]
    var steps = []; // Step[];
  
    for (var i = 0; i < 81; i++) {
      this.lockedCandidate1(i, steps);
    }
  
    return steps;
  }
  
  //----------------------------------------------------------------------------
  // LOCKED CANDIDATES 2
  //----------------------------------------------------------------------------
  
  this.lockedCandidate2 = function(index, steps) { // (int, Step[])->void
    var cell = this.table[index]; // Cell
    if (cell.count() == 1) return;
  
    // For rows and columns...
    for (var type = 0; type < 2; type++) {
      
      var setBits = cell.getSetBitIndexArray(); // int[]
      for (var bit_i = 0; bit_i < setBits.length; bit_i++) {
        var bit = setBits[bit_i] // int
  
        var count = 0; // int
        var currCell = this.firstCellInGroup(type, cell.getIndex(type)); // Cell
        for (var i = 0; i < 9; i++) {
          if (currCell.getIndex(B) != cell.getIndex(B) && currCell.isBitSet(bit)) count++;
          currCell = currCell.next(type);
        }
  
        if (count == 0) {
          // Eliminate bit from sections of box outside of row/column related to cell
  
          var actions = []; // Action[]
          var found = false; // boolean
          currCell = this.firstCellInGroup(B, cell.getBoxIndex());
          for (var i = 0; i < 9; i++) {
            if (currCell.getIndex(type) != cell.getIndex(type) && currCell.isBitSet(bit)) {
              found = true;
              currCell.unsetBit(bit);
              actions.push(new Action(currCell.getGridIndex(), UNSETBIT, bit));
            }
            currCell = currCell.next(B);
          }
  
          if (found) {
            var cells = []; // int[]
            cells.push(index);
  
            var bits = []; // int[]
            bits.push(bit);
  
            steps.push(new Step("Locked candidate type-2", cells, bits, actions, type));
            //alert("(r" + (cell.getRowIndex()+1) + ",c" + (cell.getColIndex()+1) + "): " +
            //      "Locked candidate (type-2) " + (bit+1) + " in " + cell + " [" + type + "]");
          }
        }
  
      } // End of bits loop
    } // End of type loop
  
  }
  
  this.lockedCandidates2 = function() { // void->Step[]
    var steps = []; // Step[];
  
    for (var i = 0; i < 81; i++) {
      this.lockedCandidate2(i, steps);
    }
  
    return steps;
  }

  //----------------------------------------------------------------------------
  // X-FISH
  //----------------------------------------------------------------------------
/*
  public void xFish(int x, int index, ArrayList<Step> steps) {
    Cell cell = table[index];
    if (cell.count() == 1) return;
    if (x < 2 || x > 4) return;

    // For rows and columns...
    for (char type : types) {
      if (type == 'B') continue; // Only relevant by rows and columns

      // Loop for each candidate bit
      for (int bit = 0; bit < 9; bit++) {
        if (!cell.isBitSet(bit)) continue;

        // Create list of boolean arrays; one boolean array for every group (of
        // the current type) where candidate bit is set in more than one but no
        // more than x cells
        ArrayList<boolean[]> arr = new ArrayList<boolean[]>();
        ArrayList<Integer> indexes = new ArrayList<Integer>(); // Index list corresponding to boolean arrays
        for (int i = 0; i < 9; i++) {
          Cell currCell = firstCellInGroup(type, i);
          boolean[] group = new boolean[] {false, false, false, false, false, false, false, false, false};
          int count = 0;
          for (int j = 0; j < 9; j++) {
            if (currCell.isBitSet(bit)) {
              group[j] = true;
              count++;
            }
            currCell = currCell.next(type);
          }
          if (count > 1 && count <= x) {
            arr.add(group);
            indexes.add(i);
            //System.out.println(" Added indexes(" + (indexes.size()) + ")=" + i);
          }
        }

        // If less than x groups were found then go to next candidate
        if (indexes.size() < x) continue;

        // Create a list of all possible x-group combinations
        ArrayList<int[]> combos = new ArrayList<int[]>();
        for (int i = 0; i < indexes.size()-x+1; i++) {

          for (int j = i+1; j < indexes.size()-x+2; j++) {
            if (x == 2) {
              int[] combo = new int[2];
              combo[0] = i;
              combo[1] = j;
              combos.add(combo);
              continue;
            }

            for (int k = j+1; k < indexes.size()-x+3; k++) {
              if (x == 3) {
                int[] combo = new int[3];
                combo[0] = i;
                combo[1] = j;
                combo[2] = k;
                combos.add(combo);
                continue;
              }

              for (int m = k+1; m < indexes.size()-x+4; m++) {
                if (x == 4) {
                  int[] combo = new int[4];
                  combo[0] = i;
                  combo[1] = j;
                  combo[2] = k;
                  combo[3] = m;
                  combos.add(combo);
                  continue;
                }
              }
            }
          }
        }

        // Loop for each x-group combination
        for (int i = 0; i < combos.size(); i++) {
          int[] combo = combos.get(i);

          // Set up list of indexes of the x-group combination boolean arrays
          // where the candidate bit occurs (cumulative over the x-group
          // combinations)
          ArrayList<Integer> indexes2 = new ArrayList<Integer>();
          for (int j = 0; j < 9; j++) {
            for (int k = 0; k < x; k++) {
              if (arr.get(combo[k])[j]) {
                indexes2.add(j);
                break;
              }
            }
          }
          //System.out.println("\t\tCount(" + (i+1) + "):"+indexes2.size());

          if (indexes2.size() == x) {
            // Candidate bit occurs in x indexes of the x-group combinations,
            // so this is a valid x-fish pattern
            ArrayList<Action> actions = new ArrayList<Action>();

            //System.out.println("Combination ===>");
            //for (int ii = 0; ii < combo.length; ii++) {
            //  System.out.print(indexes.get(combo[ii])+":");
            //  for (int jj = 0; jj < 9; jj++) {
            //    System.out.print(" "+arr.get(combo[ii])[jj]);
            //  }
            //  System.out.println();
            //}

            boolean found = false;
            //for (int j = 0; j < indexes2.size(); j++) {
            for (int j : indexes2) {
              for (int k = 0; k < 9; k++) {
                boolean invalid = false;
                for (int m = 0; m < x; m++) {
                  if (indexes.get(combo[m]) == k) invalid = true;
                }
                if (invalid) continue;
                Cell iCell;
                //int row, col;
                if (type == 'R') {
                  //row = k;
                  //col = indexes2.get(j);
                  iCell = table[k*9 + j];
                } else {
                  //row = indexes2.get(j);
                  //col = k;
                  iCell = table[j*9 + k];
                }
                if (iCell.isBitSet(bit)) {
                  found = true;
                  iCell.unsetBit(bit);
                  actions.add(new Action(iCell.getGridIndex(), Action.UNSETBIT, bit));
                }
              }
            }

            if (found) {
              ArrayList<Integer> cells = new ArrayList<Integer>();
              for (int j = 0; j < combo.length; j++) {
                for (int k : indexes2) {
                  if (type == 'R') {
                    cells.add(indexes.get(combo[j])*9 + k);
                  } else {
                    cells.add(k*9 + indexes.get(combo[j]));
                  }
                }
              }

              ArrayList<Integer> bits = new ArrayList<Integer>();
              bits.add(bit);

              steps.add(new Step(x+"-Fish", cells, bits, actions, type));
              //System.out.println("(r" + (cell.getRowIndex()+1) + ",c" + (cell.getColIndex()+1) + "): " +
              //                   x + "-Fish " + (bit+1) + " in " + cell + " [" + type + "]");
            }
          }
        }

      } // End of bits loop
    } // End of type loop
  }

  public ArrayList<Step> xFishes(int x) {
    ArrayList<Step> steps = new ArrayList<Step>();

    for (int i = 0; i < 81; i++) {
      xFish(x, i, steps);
    }

    return steps;
  }
*/

  //----------------------------------------------------------------------------
  // XY-WING
  //----------------------------------------------------------------------------

/*
  public void xyWing(int index, ArrayList<Step> steps) {
    Cell cell = table[index];
    if (cell.count() != 2) return;

    int b1 = cell.getSetBit(1);
    int b2 = cell.getSetBit(2);

    XYCells xyCells = new XYCells();

    // For row group, column group and box group...
    for (char type : types) {
      Cell currCell = firstCellInGroup(type, cell.getIndex(type));
      for (int j = 0; j < 9; j++) {
        if (currCell.getGridIndex() != index && currCell.count() == 2 &&
            (currCell.isBitSet(b1) ^ currCell.isBitSet(b2))) {
          if (currCell.isBitSet(b1)) {
            xyCells.add(currCell, true, type);
          } else {
            xyCells.add(currCell, false, type);
          }
        }
        currCell = currCell.next(type);
      }
    }

    //System.out.println(xyCells.toString());
    for (char b1Type : types) {
      for (Cell b1Cell : xyCells.getCells(true, b1Type)) {

        for (char b2Type : types) {
          if (b1Type == b2Type) continue;
          for (Cell b2Cell : xyCells.getCells(false, b2Type)) {
            if (b1Cell.getRowIndex() == b2Cell.getRowIndex() ||
                b1Cell.getColIndex() == b2Cell.getColIndex() ||
                b1Cell.getBoxIndex() == b2Cell.getBoxIndex()) continue;
            //System.out.println("b1="+b1Cell.toString());
            //System.out.println(" b2="+b2Cell.toString());
            int bit;
            if (b2Cell.isBitSet(b1Cell.getSetBit(1))) {
              bit = b1Cell.getSetBit(1);
            } else if (b2Cell.isBitSet(b1Cell.getSetBit(2))) {
              bit = b1Cell.getSetBit(2);
            } else {
              //System.out.println("  No common bit");
              continue;
            }
            //System.out.println("  bit="+bit);

            ArrayList<Action> actions = new ArrayList<Action>();
            boolean found = false;
            for (int i = 0; i < 81; i++) {
              if ((b1Cell.getRowIndex() == table[i].getRowIndex() ||
                   b1Cell.getColIndex() == table[i].getColIndex() ||
                   b1Cell.getBoxIndex() == table[i].getBoxIndex()) &&
                  (b2Cell.getRowIndex() == table[i].getRowIndex() ||
                   b2Cell.getColIndex() == table[i].getColIndex() ||
                   b2Cell.getBoxIndex() == table[i].getBoxIndex()) &&
                  table[i].isBitSet(bit)) {
                found = true;
                //System.out.println("  found="+table[i].toString());
                table[i].unsetBit(bit);
                actions.add(new Action(i, Action.UNSETBIT, bit));
              }
            }

            if (found) {
              ArrayList<Integer> cells = new ArrayList<Integer>();
              cells.add(index);
              cells.add(b1Cell.getGridIndex());
              cells.add(b2Cell.getGridIndex());

              ArrayList<Integer> bits = new ArrayList<Integer>();
              bits.add(bit);

              steps.add(new Step("XY-Wing", cells, bits, actions, ' '));
            }

          }
        }

      }
    }

  }

  public ArrayList<Step> xyWings() {
    ArrayList<Step> steps = new ArrayList<Step>();

    for (int i = 0; i < 81; i++) {
      xyWing(i, steps);
    }

    return steps;
  }

*/



  //----------------------------------------------------------------------------
  // IS THE GRID VALID?
  //----------------------------------------------------------------------------

  this.isValid = function() { // (void)->boolean
    // Check if each of the rows, columns and boxes hold all nine values
    for (var type in this.types) { // char
      for (var i = 0; i < 9; i++) {
        var cell = this.firstCellInGroup(type, i); // Cell

        var group   = "........."; // String
        var singles = "........."; // String


        for (var j = 0; j < 9; j++) {
          for (var bit = 0; bit < 9; bit++) {
            if (cell.count() == 0 || (cell.count() == 1 && !cell.isFinalised())) group = "012345678";
            if (cell.isBitSet(bit)) {
              group = group.substring(0, bit) + bit.toString() + group.substring(bit+1, 9);
              if (cell.count() == 1 && cell.isFinalised()) {
                if (singles.substring(bit, bit+1) == '.') {
                  singles = singles.substring(0, bit) + bit.toString() + singles.substring(bit+1, 9);
                } else {
                  return false;
                }
              }
            }
          }
          cell = cell.next(type);
        }

        if (group != "012345678") return false;
      }
    }
    return true;
  }

  //----------------------------------------------------------------------------
  // IS THE GRID SOLVED?
  //----------------------------------------------------------------------------

  this.isSolved = function() { // (void)->boolean
    return (this.isValid() && this.remaining() == 0);
  }

  //----------------------------------------------------------------------------
  // FINALISE GRID VALUES
  //----------------------------------------------------------------------------

  this.finalise = function() { // (void)->void
    for (var i = 0; i < 81; i++) {
      var cell = this.table[i]; // Cell
      if (cell.count() == 1) cell.finaliseCell();
    }
  }

  //----------------------------------------------------------------------------
  // FIX GRID VALUES
  //----------------------------------------------------------------------------

  this.fix = function() { // (void)->void
    for (var i = 0; i < 81; i++) {
      var cell = this.table[i]; // Cell
      if (cell.count() == 1 && cell.isFinalised()) cell.fixCell();
    }
  }


  //----------------------------------------------------------------------------
  // UNFIX GRID VALUES
  //----------------------------------------------------------------------------

  this.unfix = function() { // (void)->void
    for (var i = 0; i < 81; i++) {
      cell = this.table[i]; // Cell
      if (cell.isFixed()) cell.unfixCell();
    }
  }

  //----------------------------------------------------------------------------
  // INITIALISE CELL BITS (WHEN ALL CELL BITS ARE UNSET)
  //----------------------------------------------------------------------------

  this.initialise = function() { // (void)->void
    for (var i = 0; i < 81; i++) {
      cell = this.table[i]; // Cell
      if (cell.count() == 0) cell.setAllBits();
    }
  }

  //----------------------------------------------------------------------------
  // NUMBER OF ENTRIES REMAINING TO BE ELIMINATED
  //----------------------------------------------------------------------------

  this.remaining = function() { // (void)->int
    var n = 0; // int
    for (var i = 0; i < 81; i++) {
      var count = this.table[i].count();
      if (count == 0) {
        alert("Grid.remaining(): Unexpected operation on Cell with no bits set");
        break;
      } else {
        n += count - 1;
      }
    }
    return n;
  }








  // Constructors
  if (typeof s == "undefined") {
    this.randomGrid();
  } else if (typeof s == "string") {
    this.definedGrid(s);
  } else {
    this.arrayGrid(s);
  }

} // End of Grid object




//var xxstr = "25..16...4..5.........8..9..2..5.1.....493.......6..7..9..7.........5..21..64..38";
//var xxgrid = new Grid(xxstr);
//alert(xxgrid);
//var yygrid = new Grid();
//alert(yygrid);
