import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-adventure',
  templateUrl: './adventure.component.html',
  styleUrls: ['./adventure.component.scss'],
})
export class AdventureComponent implements OnInit, OnDestroy {
  adventure: any;
  currentNode: any;

  adventureSubscription: Subscription;
  currentNodeSubscription: Subscription;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.adventureSubscription = this.gameService.adventureEmitter.subscribe((adventure) => {
      this.adventure = adventure;
      console.log('adventureComponent adventure: ', this.adventure);
    });
    this.currentNodeSubscription = this.gameService.currentNodeEmitter.subscribe((node) => {
      this.currentNode = node;
      console.log('adventureComponent currentNode: ', this.currentNode);
    });
  }

  ngOnDestroy(): void {
    this.adventureSubscription.unsubscribe();
    this.currentNodeSubscription.unsubscribe();
  }

  printData() {
    console.log(this.gameService.currentNode);
  }
}
