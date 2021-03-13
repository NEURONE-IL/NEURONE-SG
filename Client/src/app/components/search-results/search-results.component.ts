import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game/game.service';
import { SearchService } from 'src/app/services/search/search.service';
import { StoreQueryService } from 'src/app/services/tracking/store-query.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  fetching = true;
  documents: any;
  web: any;
  images: any;
  videos: any;
  books: any;
  query: string;
  coreRoot = environment.coreRoot;
  rootPath = environment.root;

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute,
    public router: Router,
    private gameService: GameService,
    private storeQueryService: StoreQueryService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.query = params.get('query');
      this.searchService
        .fetchResults(this.query, null, this.gameService.adventure, null)
        .subscribe(
          (res) => {
            console.log(res);
            this.documents = res;
            this.web = this.documents.filter(doc => !doc.type || doc.type=='book');
            this.images = this.documents.filter(doc => doc.type == 'image');
            this.videos = this.documents.filter(doc => doc.type == 'video');
            this.books = this.documents.filter(doc => doc.type == 'book');
            this.fetching = false;
          },
          (err) => {
            this.documents = [];
            console.log(err);
          }
        );
    });
  }

  // Get Youtube thumbnail
  // adapted from: https://gist.github.com/pinceladasdaweb/6662290
  getThumb(url) {
    if (url === null) {
      return '';
    }
    let results = url.match('[\\?&]v=([^&#]*)');
    let video = results === null ? url : results[1];

    return 'http://img.youtube.com/vi/' + video + '/2.jpg';
  }

  search() {
    if (this.query !== '') {
      let queryData = {
        query: this.query,
        title: document.title,
        url: this.router.url,
        localTimeStamp: Date.now(),
      };
      this.storeQueryService.postQuery(queryData);
      this.router.navigate(['game/results/' + this.query]);
    }
  }
}
