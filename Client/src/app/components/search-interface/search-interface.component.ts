import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GameService } from 'src/app/services/game/game.service';
import { StoreQueryService } from 'src/app/services/tracking/store-query.service';

@Component({
  selector: 'app-search-interface',
  templateUrl: './search-interface.component.html',
  styleUrls: ['./search-interface.component.scss'],
})
export class SearchInterfaceComponent implements OnInit, OnDestroy {
  query: string;

  adventure: any;
  currentNode: any;

  adventureSubscription: Subscription;
  currentNodeSubscription: Subscription;
  constructor(
    public router: Router,
    private storeQueryService: StoreQueryService,
    private auth: AuthService,
    private gameService: GameService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // Subscribe to the current adventure
    this.adventureSubscription = this.gameService.adventureEmitter.subscribe(
      (adventure) => {
        this.adventure = adventure;
      }
    );
    // Subscribe to the current node
    this.currentNodeSubscription = this.gameService.currentNodeEmitter.subscribe(
      (node) => {
        this.currentNode = node;
      }
    );
  }

  ngOnDestroy(): void {
    this.adventureSubscription.unsubscribe();
    this.currentNodeSubscription.unsubscribe();
  }

  canFetchAll() {
    if (this.auth.getRole() == 'admin' || this.auth.getRole() == 'creator') {
      return true;
    } else {
      return false;
    }
  }

  search() {
    if (this.query) {
      if (this.query == '*' && !this.canFetchAll()) {
        this.translate.get('SEARCH_INTERFACE.TOASTR').subscribe((res) => {
          this.toastr.warning(res.INVALID_QUERY);
        });
      } else {
        let queryData = {
          query: this.query,
          title: document.title,
          url: this.router.url,
          localTimeStamp: Date.now(),
        };
        this.storeQueryService.postQuery(queryData);
        this.router.navigate(['game/results/' + this.query]);
      }
    } else {
      console.log('search: ' + this.query);
    }
  }
}
