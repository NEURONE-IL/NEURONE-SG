import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game/game.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-search-interface',
  templateUrl: './search-interface.component.html',
  styleUrls: ['./search-interface.component.scss']
})

export class SearchInterfaceComponent implements OnInit, OnDestroy {

  query: string;

  adventure: any;
  currentNode: any;

  adventureSubscription: Subscription;
  currentNodeSubscription: Subscription;
  constructor(public router: Router,
    private searchService: SearchService,
    private gameService: GameService) { }

  ngOnInit(): void {
    this.adventureSubscription = this.gameService.adventureEmitter.subscribe((adventure) => {
      this.adventure = adventure;
    });
    this.currentNodeSubscription = this.gameService.currentNodeEmitter.subscribe((node) => {
      this.currentNode = node;
    });
  }

  ngOnDestroy(): void {
    this.adventureSubscription.unsubscribe();
    this.currentNodeSubscription.unsubscribe();
  }


  search(){
    if(this.query){
      this.router.navigate(['game/results/' + this.query])
    }
    else {
      console.log('search: ' + this.query);
    }
  }

}
