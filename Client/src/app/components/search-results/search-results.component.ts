import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/services/game/game.service';
import { SearchService } from 'src/app/services/search/search.service';
import { StoreQueryService } from 'src/app/services/tracking/store-query.service';
import { environment } from '../../../environments/environment';
import Utils from 'src/app/utils/utils';

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
  webPaginated: any;
  imagesPaginated: any;
  videosPaginated: any;
  booksPaginated: any;
  query: string;
  pageSize: number = 12;
  currentPage: number = 1;
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
        .fetchResults(this.query, null, this.gameService.adventure._id, null)
        .subscribe(
          (res) => {
            this.documents = res;

            // Filter and paginate results
            this.filterAndPaginateResults();

            this.fetching = false;
          },
          (err) => {
            this.documents = [];
            console.log(err);
          }
        );
    });
  }

  private filterAndPaginateResults() {
    this.web = this.documents.filter(doc => !doc.type || doc.type == 'book');
    this.images = this.documents.filter(doc => doc.type == 'image');
    this.videos = this.documents.filter(doc => doc.type == 'video');
    this.books = this.documents.filter(doc => doc.type == 'book');

    this.webPaginated = Utils.paginate(this.web, this.pageSize);
    this.imagesPaginated = Utils.paginate(this.images, this.pageSize);
    this.videosPaginated = Utils.paginate(this.videos, this.pageSize);
    this.booksPaginated = Utils.paginate(this.books, this.pageSize);
  }

  get webLength() {
    return this.web.length;
  }

  get imagesLength() {
    return this.images.length;
  }

  get videosLength() {
    return this.videos.length;
  }

  get booksLength() {
    return this.books.length;
  }

  get webPages() {
    return this.webPaginated.length;
  }

  get imagesPages() {
    return this.imagesPaginated.length;
  }

  get videosPages() {
    return this.videosPaginated.length;
  }

  get booksPages() {
    return this.booksPaginated.length;
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

  onPageChange(newPage) {
    this.currentPage = newPage;
  }

  onTabChange(evt) {
    this.currentPage = 1;
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
