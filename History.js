// -----------------------------------------------------------------------------
// History object
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

function History(grid, level) { // (Grid, int)
  this.numbers = new Array(81); // String[]
  this.fixes = new Array(81); // boolean[][
  this.finalisations = new Array(81); // boolean[]
  this.level = level; // int

  for (var i = 0; i < 81; i++) {
    this.numbers[i] = grid.getCell(i);
    this.fixes[i] = grid.getCellRef(i).isFixed();
    this.finalisations[i] = grid.getCellRef(i).isFinalised();
  }

  this.equals = function(h) { // (History)->boolean
    if (this.level != h.level) return false;
    for (var i = 0; i < 81; i++) {
      if (this.numbers[i] != h.numbers[i]) return false;
      if (this.fixes[i] != h.fixes[i]) return false;
      if (this.finalisations[i] != h.finalisations[i]) return false;
    }
    return true;
  }
}
