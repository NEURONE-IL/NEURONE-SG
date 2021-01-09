import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-bar',
  templateUrl: './game-bar.component.html',
  styleUrls: ['./game-bar.component.css']
})
export class GameBarComponent implements OnInit {

  constructor(public gameService: GameService) { }

  ngOnInit(): void {
  }

  refresh() {
    window.location.reload();
  }

}
