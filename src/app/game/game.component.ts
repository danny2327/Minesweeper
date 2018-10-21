import { Component, OnInit, OnDestroy } from '@angular/core';
import { MSService } from '../ms.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(private msService: MSService) { }

  ngOnInit() {
  }

}
