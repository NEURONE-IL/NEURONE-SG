import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationStart,
  ParamMap,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GameService } from 'src/app/services/game/game.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss'],
})
export class ViewPageComponent implements OnInit, OnDestroy {
  path: string;
  title: string;
  docUrl: string;

  doc: any;
  docSubscription: Subscription;
  pathSubscription: Subscription;

  constructor(private route: ActivatedRoute, private gameService: GameService) {
    this.doc = history.state.doc;
    this.pathSubscription = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.path = params.get('path');
        this.docUrl = environment.coreRoot + '/' + this.path;
      }
    );
  }
  ngOnDestroy(): void {
    this.pathSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.gameService.checkRelevantDoc(this.doc);
  }
}
