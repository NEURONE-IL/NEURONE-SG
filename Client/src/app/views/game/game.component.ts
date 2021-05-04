import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game/game.service';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {

  searchEnabled: boolean;
  loading: boolean;

  searchEnabledSubscription: Subscription;
  loadingSubscription: Subscription;

  constructor(
    private searchService: SearchService,
    private gameService: GameService
  ) {
    this.searchEnabledSubscription = this.searchService.searchEnabledEmitter.subscribe(
      (searchEnabled) => {
        this.searchEnabled = searchEnabled;
      }
    );
    this.loadingSubscription = this.gameService.loadingEmitter.subscribe((loading) => {
      this.loading = loading;
    });
  }
  ngOnDestroy(): void {
    this.searchEnabledSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
    this.gameService.reset();
  }

  ngOnInit(): void {}
}
