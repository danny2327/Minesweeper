import { Component, OnInit, OnDestroy } from '@angular/core';
import { MSService } from '../ms.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit, OnDestroy {
  gameTime = 0;
  minesLeft: number;
  minesSub: Subscription;
  gameStatus: string;  // 'playing', 'won', 'lost', 'new'
  gameStatusSub: Subscription;
  timer;
  showGameMenu = false;
  size: number;
  mines: number;

  constructor(private msService: MSService) { }

  ngOnInit() {
    this.minesLeft = this.msService.mines;
    this.minesSub = this.msService.minesChanged.subscribe(
      (minesLeft) => {
        this.minesLeft = minesLeft;
       });

    this.gameStatus = 'playing';
    this.gameStatusSub = this.msService.gameStatusChanged.subscribe(
      (status) => {
        this.gameStatus = status;
        if (this.gameStatus === 'playing') {
          this.timer = setInterval(() => { this.gameTime++; }, 1000);
        } else {
          clearInterval(this.timer);
          if (this.gameStatus === 'new') {
            this.gameTime = 0;
          }
        }
      }
    );

    this.size = this.msService.rows;
    this.mines = Math.floor(this.size * this.size * .15);
  }

  clickOnFace() {
    this.gameStatus = 'new';
    this.msService.newGame(this.size, this.mines);
  }

  getFace() {
    let face = '';
    switch (this.gameStatus) {
      case 'won':
        face = '../../assets/images/won.PNG';
        break;
      case 'lost':
        face = '../../assets/images/lost.PNG';
        break;
      default:
        face = '../../assets/images/happy.PNG';
    }
    return face;
  }

  ngOnDestroy() {
    this.minesSub.unsubscribe();
    this.gameStatusSub.unsubscribe();
  }

  onClickNew() {
    this.msService.newGame(this.size, this.mines);
  }

}
