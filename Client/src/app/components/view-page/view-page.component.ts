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
  cleanURL: string;  

  doc: any;
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
    this.dispatchPageExit();
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
    this.dispatchPageEnter();  
  }

  dispatchPageEnter(){
    /*Clean URL*/
    //URL example: http://localhost:4200/game/view-page/assets%2FdownloadedDocs%2Fdr-who-aliens%2Fen.wikipedia.org%2Fwiki%2FList_of_Doctor_Who_universe_creatures_and_aliens%2Findex.html
    const titleArray = window.location.href.split('/');
    //Get docURL
    let rawUrl = decodeURIComponent(titleArray[5]);
    //Remove the URL prefix from NEURONE Core
    const urlArray = rawUrl.split('/');
    let docURL = '';
    for(var i=3; i<urlArray.length; i++){
      docURL += urlArray[i] + '/';
    }
    //Remove the URL postfix from NEURONE Core
    docURL = docURL.split(';')[0];
    this.cleanURL = docURL.replace('/index.html', '');
    /*End Clean URL*/
    /*Dispatch pageenter event*/
    var evt = new CustomEvent('pageenter', { detail: 'Enter to "' + this.cleanURL + '"' });
    window.dispatchEvent(evt);
    /*End dispatch pageenter event*/      
  }

  dispatchPageExit(){
    if(this.cleanURL){
      /*Dispatch pageexit event*/
      var evt = new CustomEvent('pageexit', { detail: 'Exit from "' + this.cleanURL + '"' });
      window.dispatchEvent(evt);
      /*End dispatch pageexit event*/    
    }
  }

  trackIFrame() {
    if (this.isInited) {
      this.kmTrackerIframe.start();
    }
  }
}
