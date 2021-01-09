import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-adventure',
  templateUrl: './adventure.component.html',
  styleUrls: ['./adventure.component.css']
})
export class AdventureComponent implements OnInit {

  constructor(public gameService: GameService) { }

  ngOnInit(): void {}

  printData() {
    console.log(this.gameService.currentNode);
  }

}
