import { Component, OnInit, OnDestroy } from '@angular/core';
import { Square } from './square/square.model';
import { MSService } from './ms.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  size = 100;
  rows: number[] = [];
  mines: number;
  squares: Square[] = [];
  squaresSub: Subscription;
  clickedSub: Subscription;
  // gameStatus: string;
  // gameStatusSub: Subscription;

  constructor(private msservice: MSService) {}

  ngOnInit() {
    this.mines =  Math.floor(this.size * .15);

    this.squares = this.msservice.startNewGame(this.size, this.mines);

    this.rows = this.getRows(this.size);

    this.squaresSub = this.msservice.squaresChanged.subscribe(
      (squares) => {
        this.squares = squares;
      }
    );


  }

  getRows(size: number) {
    for (let row = 1; row < Math.sqrt(this.size); row++) {
      this.rows[row] = row;
    }
    return this.rows;
  }

  onClick(event) {

    if (event.buttons === 1) {
      // console.log('left click on app');
      // console.log(event.target);
      // this.msservice.appClicked();
    }
  }

  onRightClick(event) {
    // make right click do nothing
    return false;
  }

  getWidth() {
    const width = 25 * Math.sqrt(this.size);
    return width + 20;
  }

  ngOnDestroy() {
    this.squaresSub.unsubscribe();
    this.clickedSub.unsubscribe();
  }

}
