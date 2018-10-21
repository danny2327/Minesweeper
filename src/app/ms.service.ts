import { Injectable } from '@angular/core';
import { Square } from './square/square.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MSService {
  size: number;
  rows: number;
  mines: number;
  // minesLeftToFlag: number;
  minesFlagged: number[] = [];
  gameStatus: string;  // 'playing', 'won', 'lost'
  squares: Square[] = [];
  squaresNotExposed: number;

  squaresChanged = new Subject<Square[]>();
  clickedSub = new Subject<number>();
  minesChanged = new Subject<number>();
  gameStatusChanged = new Subject<string>();

  constructor() { }

  startNewGame(size: number, mines: number) {
    this.size = size;
    this.mines = mines;
    console.log('mines: ' + mines);
    this.rows = Math.sqrt(this.size);
    this.gameStatus = 'new';
    this.squaresNotExposed = this.size;
    // console.log('this.size');
    // console.log(this.size);
    // console.log('this.rows');
    // console.log(this.rows);
    console.log('this.mines');
    console.log(this.mines);
    // console.log('this.squaresNotExposed');
    // console.log(this.squaresNotExposed);

    this.getInfo();
    return this.squares;
  }

  newGame(size: number, mines: number) {
    console.log('mines: ' + mines);
    this.minesFlagged = [];
    this.squares = [];
    this.minesChanged.next(this.mines);
    this.startNewGame((size * size), mines);
    this.squaresChanged.next(this.squares.slice());
    this.updateGameStatus('new');
  }

  getInfo() {
    let minesLeft = this.mines;

    console.log('this.mines');
    console.log(this.mines);
    const oddsOfMine = (this.mines / this.size);
    for (let i = 1; i < this.size + 1; i++) {
      // let hasMine = false;
      // if (minesLeft > 0) {
      //   const m = Math.random();
      //   if (m < oddsOfMine) {
      //     minesLeft--;
      //     hasMine = true;
      //   }
      // }
       this.addSquare(i, false);
    }

    console.log('minesLeft');
    console.log(minesLeft);

    console.log('squares');
    console.log(this.squares);

    while (minesLeft > 0) {
      console.log('minesLeft');
      console.log(minesLeft);
      const r = Math.ceil(Math.random() * this.size);
      if (!this.squares[r].hasMine) {
        this.addSquare(r, true);
        minesLeft--;
      }
    }

    this.calculateMinesNear();

    this.squaresChanged.next(this.squares.slice());
  }

  calculateMinesNear() {
    this.squares.forEach(square => {
      let mines = 0;
      if (!square.hasMine) {
        const index = square.index;
        const squaresToTest = this.getSquaresToTest(index);
        for (const k of Object.keys(squaresToTest)) {
          if (this.squares[squaresToTest[k]].hasMine) {
            mines++;
          }
        }
      }
      square.minesNear = mines;
    });
  }

  addSquare(i, hasMine) {
    // index: number, hasMine: boolean, isExposed: boolean, isFlagged: boolean, minesNear: number
    this.squares[i] = new Square(i, hasMine, false, false, 0);
  }

  getSquaresToTest(index: number): number[] {
    const squaresToTest: number[] = [];

    // straight above
    squaresToTest['top'] = (index - this.rows);
    // straight above and to left
    squaresToTest['topLeft'] = (index - this.rows - 1);
    // straight above and to right
    squaresToTest['topRight'] = (index - this.rows + 1);
    // straight below
    squaresToTest['bottom'] = (index + this.rows);
    // straight below and to the left
    squaresToTest['bottomLeft'] = (index + this.rows - 1);
    // straight below and to the right
    squaresToTest['bottomRight'] = (index + this.rows + 1);
    // to the left
    squaresToTest['left'] = (index - 1);
    // to the right
    squaresToTest['right'] = (index + 1);

    if (index - this.rows < 1) {  // is top row
      delete squaresToTest['top'];
      delete squaresToTest['topLeft'];
      delete squaresToTest['topRight'];
    } else if (index + this.rows > this.size) {  // is bottom row
      delete squaresToTest['bottom'];
      delete squaresToTest['bottomLeft'];
      delete squaresToTest['bottomRight'];
    }

    if (index % this.rows === 1) {  // is left side
      delete squaresToTest['left'];
      delete squaresToTest['topLeft'];
      delete squaresToTest['bottomLeft'];
    } else if (index % this.rows === 0) {  // is right side
      delete squaresToTest['right'];
      delete squaresToTest['topRight'];
      delete squaresToTest['bottomRight'];
    }
    return squaresToTest;
  }

  squareClicked(index: number) {
    // if first click of the game
    if (this.squaresNotExposed === this.size) {
      this.updateGameStatus('playing');
    }

    const square = this.squares[index];
    if (square.hasMine) {
      this.lost();
    } else {
      if (square.minesNear === 0) {
        let stillMoreToCheck: number[] = this.getSquaresToTest(index);

        while ((Object.keys(stillMoreToCheck)).length > 0) {
          stillMoreToCheck = this.clearSurroundingSquares(stillMoreToCheck);
        }
      }
    }
    this.squaresNotExposed--;
    this.checkIfAllClear();
    this.clickedSub.next(index);
  }

  appClicked(index: number) {
    const square = this.squares[index];
    if (square.minesNear > 0) {
      const SQT = Object.values(this.getSquaresToTest(index));
      let flaggedNear = 0;
      SQT.forEach(squareToTest => {
        if (this.squares[squareToTest].isFlagged) {
          flaggedNear++;
        }
      });
      if (flaggedNear === square.minesNear) {
        SQT.forEach(squareToTest => {
          const squareTest = this.squares[squareToTest];
          if (!squareTest.isFlagged) {
            if (!squareTest.isExposed) {
              squareTest.isExposed = true;
              this.squareClicked(squareTest.index);
            }
          }
        });
      }
    }
  }

  lost() {
    console.log('Fucking Kaboom. You Dead!');
    this.squares.forEach(square => {
      square.isExposed = true;
    });
    this.updateGameStatus('lost');

  }

  won(type: string) {
    this.updateGameStatus('won');
    alert('You Win');
    if (type === 'flagged') {
      this.squares.forEach(square => {
        if (!square.isFlagged) {
          square.isExposed = true;
        }
      });
      } else if (type === 'exposed') {
        this.squares.forEach(square => {
          if (!square.isExposed) {
            square.isFlagged = true;
            this.squaresChanged.next(this.squares.slice());
          }
        });
      }
  }

  flagged(index: number) {
    const sq = this.squares[index];
    if (!sq.isFlagged) {
      sq.isFlagged = true;
      this.minesFlagged.push(index);
    } else {
      sq.isFlagged = false;
      if (this.minesFlagged.indexOf(index) !== -1) {
        this.minesFlagged.splice(this.minesFlagged.indexOf(index), 1);
      }
    }
    const minesLeft = this.mines - this.minesFlagged.length;
    this.minesChanged.next(minesLeft);
    if (minesLeft === 0 ) {
      this.checkForFlaggedWin();
    }
  }

  checkForFlaggedWin() {
    // should only get called when a number of squares flagged equal to the number of mines
    let win = true;
    this.minesFlagged.forEach(flag => {
      if (!this.squares[flag].hasMine) {
        win = false;
      }
    });
    if (win) {
      this.won('flagged');
    }
  }

  clearSurroundingSquares(surrounding: number[]): number[] {
    const moreToCheck: number[] = [];
    for (const s of Object.values(surrounding)) {
      const square = this.squares[s];

      if (!square.isExposed && !square.isFlagged) {
        square.isExposed = true;
        this.squaresNotExposed--;
        let squaresToTestList: number[];
        if (square.minesNear === 0) {
          squaresToTestList = this.getSquaresToTest(square.index);
          squaresToTestList = Object.values(squaresToTestList);
          squaresToTestList.forEach(toAdd => {
            moreToCheck.push(toAdd);
          });
        }
      }
    }
    return moreToCheck;
  }


  checkIfAllClear() {
    if (this.squaresNotExposed === this.mines) {
      this.won('exposed');
    }
  }

  updateGameStatus(status: string) {
    this.gameStatus = status;
    this.gameStatusChanged.next(this.gameStatus);
  }

  gameActive() {
    return (this.gameStatus === 'new' || this.gameStatus === 'playing' );
  }
}
