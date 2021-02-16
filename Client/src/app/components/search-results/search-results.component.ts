import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game/game.service';
import { SearchService } from 'src/app/services/search/search.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  fetching = true;
  documents: any;
  query: string;
  coreRoot = environment.coreRoot;

  constructor(
    private search: SearchService,
    private route: ActivatedRoute,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.query = params.get('query');
      this.search
        .fetchResults(
          this.query,
          null,
          this.gameService.adventure,
          null
        )
        .subscribe(
          (res) => {
            console.log(res);
            this.documents = res;
            this.fetching = false;
          },
          (err) => {
            console.log(err);
          }
        );
    });
  }

  visitResult() {

  }
}
