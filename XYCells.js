// -----------------------------------------------------------------------------
// XYCells object
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

function XYCells() { // (void)
  this.b1RowCells = []; // Cell[]
  this.b1ColCells = []; // Cell[]
  this.b1BoxCells = []; // Cell[]
  this.b2RowCells = []; // Cell[]
  this.b2ColCells = []; // Cell[]
  this.b2BoxCells = []; // Cell[]

  this.add = function(cell, first, type) { // (Cell, boolean, int)->void
    if (first) {
      switch (type) {
        case R: this.b1RowCells.push(cell); break;
        case C: this.b1ColCells.push(cell); break;
        case B: this.b1BoxCells.push(cell); break;
        default: break;
      }
    } else {
      switch (type) {
        case R: this.b2RowCells.push(cell); break;
        case C: this.b2ColCells.push(cell); break;
        case B: this.b2BoxCells.push(cell); break;
        default: break;
      }
    }
  }

  this.getCells = function(first, type) { // (boolean, int)->Cell[]
    if (first) {
      switch (type) {
        case R: return this.b1RowCells;
        case C: return this.b1ColCells;
        case B: return this.b1BoxCells;
        default: return null;
      }
    } else {
      switch (type) {
        case R: return this.b2RowCells;
        case C: return this.b2ColCells;
        case B: return this.b2BoxCells;
        default: return null;
      }
    }
  }

  this.toString = function() { // (void)->String
    var s = '';

    s += "b1RowCells:";
    for (var i = 0; i < b1RowCells.length; i++) s += " "+this.b1RowCells[i].toString();

    s += "\nb1ColCells:";
    for (var i = 0; i < b1ColCells.length; i++) s += " "+this.b1ColCells[i].toString();

    s += "\nb1BoxCells:";
    for (var i = 0; i < b1BoxCells.length; i++) s += " "+this.b1BoxCells[i].toString();

    s += "\nb2RowCells:";
    for (var i = 0; i < b2RowCells.length; i++) s += " "+this.b2RowCells[i].toString();

    s += "\nb2ColCells:";
    for (var i = 0; i < b2ColCells.length; i++) s += " "+this.b2ColCells[i].toString();

    s += "\nb2BoxCells:";
    for (var i = 0; i < b2BoxCells.length; i++) s += " "+this.b2BoxCells[i].toString();
    
    return s;
  }
}
