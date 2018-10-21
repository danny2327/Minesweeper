export class Square {
  constructor(
    public index: number,
    public hasMine: boolean,
    public isExposed: boolean,
    public isFlagged: boolean,
    public minesNear: number
  ) {

  }

 }
