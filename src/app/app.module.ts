import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MSService } from './ms.service';
import { AppComponent } from './app.component';
import { SquareComponent } from './square/square.component';
import { ControlComponent } from './control/control.component';
import { GameComponent } from './game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    SquareComponent,
    ControlComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [MSService],
  bootstrap: [AppComponent]
})
export class AppModule { }
