// -----------------------------------------------------------------------------
// Action object
// -----------------------------------------------------------------------------
// MIT License
//
// Copyright (c) 2017 M. Luff
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
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
