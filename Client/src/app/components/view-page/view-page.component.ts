import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationStart,
  ParamMap,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GameService } from 'src/app/services/game/game.service';
import { SearchService } from 'src/app/services/search/search.service';
import { environment } from '../../../environments/environment';
import { KmTrackerIframeService } from '../../services/tracking/kmtracker-iframe.service';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss'],
})
export class ViewPageComponent implements OnInit, OnDestroy, AfterViewInit {
  path: string;
  title: string;
  docUrl: string;
  fetchingDoc = true;
  isInited = false;

  doc: any;
  docSubscription: Subscription;
  pathSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private searchService: SearchService,
    private kmTrackerIframe: KmTrackerIframeService
  ) {}
  ngAfterViewInit(): void {
    this.isInited = true;
  }
  ngOnDestroy(): void {
    this.searchService.setCurrentPage(null);
    this.kmTrackerIframe.stop();
    this.pathSubscription.unsubscribe();
    this.docSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.doc = history.state.doc;
    this.pathSubscription = this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.path = params.get('path');
        this.docUrl = environment.root + '/' + this.path;
        this.fetchingDoc = false;
        this.gameService.checkRelevantDoc(this.doc);
      }
    );
    this.searchService.setCurrentPage(this.doc);
  }

  trackIFrame() {
    if (this.isInited) {
      this.kmTrackerIframe.start();
    }
  }
}
