import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../../services/game/game.service';
import { environment } from 'src/environments/environment';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-adventure',
  templateUrl: './adventure.component.html',
  styleUrls: ['./adventure.component.scss'],
})
export class AdventureComponent implements OnInit, OnDestroy {
  adventure: any;
  currentNode: any;
  searchEnabled: any;

  adventureSubscription: Subscription;
  currentNodeSubscription: Subscription;
  searchEnabledSubscription: Subscription;

  apiUrl = environment.apiUrl;
  currentMedia: string;

  constructor(
    private gameService: GameService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.adventureSubscription = this.gameService.adventureEmitter.subscribe(
      (adventure) => {
        this.adventure = adventure;
      }
    );
    // Subscribe to the current node
    this.currentNodeSubscription = this.gameService.currentNodeEmitter.subscribe(
      (node) => {
        this.currentNode = node;
        if (this.currentNode.data.image_id) this.currentMedia = 'image';
        else if (this.currentNode.data.video) this.currentMedia = 'video';
        else this.currentMedia = 'none';
      }
    );
    // Subscribe to the search enabled boolean
    this.searchEnabledSubscription = this.searchService.searchEnabledEmitter.subscribe(
      (searchEnabled) => {
        this.searchEnabled = searchEnabled;
      }
    );
  }

  toggleSearch() {
    this.searchService.toggleSearch();
  }

  ngOnDestroy(): void {
    this.adventureSubscription.unsubscribe();
    this.currentNodeSubscription.unsubscribe();
  }
}
