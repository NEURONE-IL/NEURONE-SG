import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { StoreTrackService } from './store-track.service';

const ADVENTURE_KEY = 'adventureId';

@Injectable({
  providedIn: 'root'
})
export class ActionsTrackerService {
  isTracking = false;
  boundFunctions = [];

  user: any;

  constructor(
    private auth: AuthService,
    private storeService: StoreTrackService
  ) {}

  start() {
    if (!this.isTracking) {
      console.log('-----------------------------------');
      console.log('START ActionsTracking service');
      console.log('-----------------------------------');
      let targetDoc = window;

      let data = {
        w: window,
        d: document,
        e: document.documentElement,
        g: document.getElementsByTagName('body')[0],
      };

      /*Custom events*/
      this.bindEvent(targetDoc, 'openinstructionsmodal', data, this.openinstructionsmodalListener);
      this.bindEvent(targetDoc, 'closeinstructionsmodal', data, this.closeinstructionsmodalListener);
      this.bindEvent(targetDoc, 'changepage', data, this.changepageListener);
      this.bindEvent(targetDoc, 'previouspage', data, this.previouspageListener);
      this.bindEvent(targetDoc, 'nextpage', data, this.nextpageListener);
      this.bindEvent(targetDoc, 'changetowebpagestab', data, this.changetowebpagestabListener);
      this.bindEvent(targetDoc, 'changetoimagestab', data, this.changetoimagestabListener);
      this.bindEvent(targetDoc, 'changetovideostab', data, this.changetovideostabListener);
      this.bindEvent(targetDoc, 'showneuronesearch', data, this.showneuronesearchListener);
      this.bindEvent(targetDoc, 'hideneuronesearch', data, this.hideneuronesearchListener);
      this.bindEvent(targetDoc, 'pageenter', data, this.pageenterListener);
      this.bindEvent(targetDoc, 'pageexit', data, this.pageexitListener);
      /*End custom events*/
      this.isTracking = true;
    }
  }

  stop() {
    if (this.isTracking) {
      console.log('-----------------------------------');
      console.log('STOP ActionsTracking service');
      console.log('-----------------------------------');
      let targetDoc = window;

      /*Custom events*/
      this.unbindAll(targetDoc, 'openinstructionsmodal');
      this.unbindAll(targetDoc, 'closeinstructionsmodal');
      this.unbindAll(targetDoc, 'changepage');
      this.unbindAll(targetDoc, 'previouspage');
      this.unbindAll(targetDoc, 'nextpage');
      this.unbindAll(targetDoc, 'changetowebpagestab');
      this.unbindAll(targetDoc, 'changetoimagestab');
      this.unbindAll(targetDoc, 'changetovideostab');
      this.unbindAll(targetDoc, 'showneuronesearch');
      this.unbindAll(targetDoc, 'hideneuronesearch');
      this.unbindAll(targetDoc, 'pageenter');
      this.unbindAll(targetDoc, 'pageexit'); 
      /*End custom events*/
      this.unbindData(targetDoc);
      this.isTracking = false;
    }
  }

  bindEvent(elem, evt, data, fn) {
    this.boundFunctions.push(fn);
    elem.addEventListener(evt, fn);
    elem.data = data;
    elem.storeService = this.storeService;
    this.user = {
      id: this.auth.getUser()._id,
      email: this.auth.getUser().email,
      study: this.auth.getUser().study
    }
    elem.user = this.user;
  }

  unbindAll(elem, evt) {
    this.boundFunctions.forEach((boundFn) => {
      elem.removeEventListener(evt, boundFn);
    });
  }

  unbindData(elem) {
    delete elem.data;
    delete elem.storeService;
  }

  openinstructionsmodalListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      adventureId: sessionStorage.getItem(ADVENTURE_KEY),
      source: 'InstructionsModal',
      type: 'OpenInstructionsModal',
      localTimeStamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }

  closeinstructionsmodalListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      adventureId: sessionStorage.getItem(ADVENTURE_KEY),
      source: 'InstructionsModal',
      type: 'CloseInstructionsModal ',
      localTimeStamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }   
  
  changepageListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      adventureId: sessionStorage.getItem(ADVENTURE_KEY),
      source: 'Pagination',
      type: 'ChangePage',
      localTimeStamp: t,
      url: doc.URL,
      detail: evt.detail
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }      

  previouspageListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      adventureId: sessionStorage.getItem(ADVENTURE_KEY),
      source: 'Pagination',
      type: 'PreviousPage',
      localTimeStamp: t,
      url: doc.URL,
      detail: evt.detail
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }
  
  nextpageListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      adventureId: sessionStorage.getItem(ADVENTURE_KEY),
      source: 'Pagination',
      type: 'NextPage',
      localTimeStamp: t,
      url: doc.URL,
      detail: evt.detail
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }

  changetowebpagestabListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      adventureId: sessionStorage.getItem(ADVENTURE_KEY),
      source: 'SearchResultsTabs',
      type: 'ChangeToWebPagesTab',
      localTimeStamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  } 
  
  changetoimagestabListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      adventureId: sessionStorage.getItem(ADVENTURE_KEY),
      source: 'SearchResultsTabs',
      type: 'ChangeToImagesTab',
      localTimeStamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }
  
  changetovideostabListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      adventureId: sessionStorage.getItem(ADVENTURE_KEY),
      source: 'SearchResultsTabs',
      type: 'ChangeToVideosTab',
      localTimeStamp: t,
      url: doc.URL,
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }  

  showneuronesearchListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      adventureId: sessionStorage.getItem(ADVENTURE_KEY),
      source: 'NEURONESearch',
      type: 'ShowNEURONESearch',
      localTimeStamp: t,
      url: doc.URL
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }
  
  hideneuronesearchListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      adventureId: sessionStorage.getItem(ADVENTURE_KEY),
      source: 'NEURONESearch',
      type: 'HideNEURONESearch',
      localTimeStamp: t,
      url: doc.URL
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }  
  
  pageenterListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      adventureId: sessionStorage.getItem(ADVENTURE_KEY),
      source: 'Window',
      type: 'PageEnter',
      localTimeStamp: t,
      url: doc.URL,
      detail: evt.detail
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }  

  pageexitListener(evt){
    evt = evt || event;

    let t = Date.now(),
    doc = evt.currentTarget.data.d;

    let keyOutput = {
      userId: this.user.id,
      adventureId: sessionStorage.getItem(ADVENTURE_KEY),
      source: 'Window',
      type: 'PageExit',
      localTimeStamp: t,
      url: doc.URL,
      detail: evt.detail
    };

    // console.log(keyOutput);
    evt.currentTarget.storeService.postEvent(keyOutput);
  }   

}