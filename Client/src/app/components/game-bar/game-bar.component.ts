import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game/game.service';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-game-bar',
  templateUrl: './game-bar.component.html',
  styleUrls: ['./game-bar.component.scss']
})
export class GameBarComponent implements OnInit {

  constructor(public gameService: GameService,
              public searchService: SearchService) { }

  ngOnInit(): void {
  }

  refresh() {
    window.location.reload();
  }

}
