import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(public searchService: SearchService,
              public gameService: GameService) { }

  ngOnInit(): void {
  }

}
