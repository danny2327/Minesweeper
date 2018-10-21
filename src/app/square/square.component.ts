import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Square } from './square.model';
import { MSService } from '../ms.service';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit, OnChanges {
  marked = false;

  constructor(private msService: MSService) { }
  @Input() square: Square;
  exposed = false;
  // minesNear: number;
  // @Input() hasMine: boolean;

  ngOnInit() {

  }

  onClick(event) {
    event.cancelBubble = true;
    if (event.buttons === 1 && !this.marked && this.msService.gameActive()) {
      // event.target.remove();
      this.square.isExposed = true;
      this.msService.squareClicked(this.square.index);
    }
  }

  onRightClick(event) {
    this.marked = !this.marked;
    event.cancelBubble = true;
    if (this.msService.gameActive()) {
      this.msService.flagged(this.square.index);
    }
    return false;
  }

  getTextColour(m: number) {
    let colour: string;
    switch (m) {
      case 0:
      colour = 'transparent';
        break;
      case 1:
      colour = 'blue';
        break;
      case 2:
        colour =  'green';
        break;
      case 3:
        colour =  'red';
        break;
      case 4:
        colour =  'purple';
        break;
      case 5:
        colour =  'black';
        break;
      case 6:
        colour =  'maroon';
        break;
      case 7:
        colour =  'grey';
        break;
      case 8:
        colour =  'turquoise';
        break;
    }
    return colour;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // resets upon new game
    this.marked = false;
  }

  onClickMinesNear(index: number) {
    this.msService.appClicked(index);
  }

}
