import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { CanExitGuard } from 'src/app/helpers/guards/can-exit.guard';
import { GameService } from 'src/app/services/game/game.service';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy, CanExitGuard {

  searchEnabled: boolean;
  loading: boolean;
  exitMessage: string;

  searchEnabledSubscription: Subscription;
  loadingSubscription: Subscription;

  constructor(
    private searchService: SearchService,
    private gameService: GameService,
    private translate: TranslateService
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

  ngOnInit(): void {
    this.translate.get("EXIT_WARNINGS").subscribe(res => {
      this.exitMessage = res.GAME;
    });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return false;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
        $event.returnValue = this.exitMessage;
    }
  }

}
