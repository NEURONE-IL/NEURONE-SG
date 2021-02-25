import { Injectable } from '@angular/core';
import { StoreTrackService } from './store-track.service';
import * as _ from 'lodash';

/*
 * Keyboard and mouse tracking service.
 * Adapted for Angular from AngularJS based on the
 * original work of Daniel Gacitua <daniel.gacitua@usach.cl>
 * https://github.com/NEURONE-IL/neurone
 */

@Injectable({
  providedIn: 'root',
})
export class KmTrackerService {
  isTracking = false;
  boundFunctions = [];

  constructor(private storeService: StoreTrackService) {}

  start() {
    console.log('-----------------------------------');
    console.log('START KMtracking service');
    console.log('-----------------------------------');
    let targetDoc = window;

    let data = {
      w: window,
      d: document,
      e: document.documentElement,
      g: document.getElementsByTagName('body')[0],
    };

    this.bindThrottledEvent(
      targetDoc,
      'mousemove',
      data,
      this.mouseMoveListener,
      250
    );
    this.bindThrottledEvent(
      targetDoc,
      'scroll',
      data,
      this.scrollListener,
      250
    );
    this.bindEvent(targetDoc, 'click', data, this.mouseClickListener);
    this.bindEvent(targetDoc, 'keydown', data, this.keydownListener);
    this.bindEvent(targetDoc, 'keypress', data, this.keypressListener);
    this.bindEvent(targetDoc, 'keyup', data, this.keyupListener);

    this.isTracking = true;
  }

  stop() {
    if (this.isTracking) {
      console.log('-----------------------------------');
      console.log('STOP KMtracking service');
      console.log('-----------------------------------');
      let targetDoc = window;

      let data = {
        w: window,
        d: document,
        e: document.documentElement,
        g: document.getElementsByTagName('body')[0],
      };

      this.unbindAll(targetDoc, 'mousemove');
      this.unbindAll(targetDoc, 'scroll');
      this.unbindAll(targetDoc, 'click');
      this.unbindAll(targetDoc, 'keydown');
      this.unbindAll(targetDoc, 'keypress');
      this.unbindAll(targetDoc, 'keyup');
      this.unbindData(targetDoc);

      this.isTracking = false;
    }
  }

  bindEvent(elem, evt, data, fn) {
    this.boundFunctions.push(fn);
    elem.addEventListener(evt, fn);
    elem.data = data;
    elem.storeService = this.storeService;
  }

  bindThrottledEvent(elem, evt, data, fn, delay) {
    const throttledFn = _.throttle(fn, delay, { trailing: false });
    this.boundFunctions.push(throttledFn);
    elem.addEventListener(evt, throttledFn);
    elem.data = data;
    elem.storeService = this.storeService;
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

  mouseClickListener(evt) {
    if (true) {
      // From http://stackoverflow.com/a/11744120/1319998
      let win = evt.currentTarget.data.w,
        doc = evt.currentTarget.data.d,
        elm = evt.currentTarget.data.e,
        gtb = evt.currentTarget.data.g,
        w = window.innerWidth || elm.clientWidth || gtb.clientWidth,
        h = window.innerHeight || elm.clientHeight || gtb.clientHeight,
        time = Date.now();

      let docX = evt.pageX,
        docY = evt.pageY,
        winX = evt.clientX,
        winY = evt.clientY,
        docW = doc.body.clientWidth,
        docH = doc.body.clientWidth,
        winW = w,
        winH = h;

      let clickOutput = {
        type: 'MouseClick',
        source: 'Window',
        url: doc.URL,
        x_win: winX,
        y_win: winY,
        w_win: winW,
        h_win: winH,
        x_doc: docX,
        y_doc: docY,
        w_doc: docW,
        h_doc: docH,
        localTimestamp: time,
      };
      // console.log(clickOutput);
      evt.currentTarget.storeService.postMouseClick(clickOutput);
    }
  }

  keydownListener(evt) {
    evt = evt || event;

    let t = Date.now(),
      w = evt.which,
      kc = evt.keyCode,
      chc = evt.charCode,
      key = evt.key || '',
      chr = String.fromCharCode(kc || chc),
      doc = evt.currentTarget.data.d;

    if (true) {
      let keyOutput = {
        type: 'KeyDown',
        source: 'Window',
        which: w,
        keyCode: kc,
        charCode: chc,
        key: key,
        chr: chr,
        localTimestamp: t,
        url: doc.URL,
      };
      // console.log(keyOutput);
      evt.currentTarget.storeService.postKeyStroke(keyOutput);
    }
  }

  keyupListener(evt) {
    evt = evt || event;

    let t = Date.now(),
      w = evt.which,
      kc = evt.keyCode,
      chc = evt.charCode,
      key = evt.key || '',
      chr = String.fromCharCode(kc || chc),
      doc = evt.currentTarget.data.d;

    if (true) {
      let keyOutput = {
        type: 'KeyUp',
        source: 'Window',
        which: w,
        keyCode: kc,
        charCode: chc,
        key: key,
        chr: chr,
        localTimestamp: t,
        url: doc.URL,
      };

      // console.log(keyOutput);
      evt.currentTarget.storeService.postKeyStroke(keyOutput);
    }
  }

  keypressListener(evt) {
    evt = evt || event;

    let t = Date.now(),
      w = evt.which,
      kc = evt.keyCode,
      chc = evt.charCode,
      key = evt.key || '',
      chr = String.fromCharCode(kc || chc),
      doc = evt.currentTarget.data.d;

    if (true) {
      let keyOutput = {
        type: 'KeyPress',
        source: 'Window',
        which: w,
        keyCode: kc,
        charCode: chc,
        key: key,
        chr: chr,
        localTimestamp: t,
        url: doc.URL,
      };

      // console.log(keyOutput);
      evt.currentTarget.storeService.postKeyStroke(keyOutput);
    }
  }

  mouseMoveListener(evt) {
    if (true) {
      // From http://stackoverflow.com/a/23323821
      let win = evt.currentTarget.data.w,
        doc = evt.currentTarget.data.d,
        elm = evt.currentTarget.data.e,
        gtb = evt.currentTarget.data.g,
        w = window.innerWidth || elm.clientWidth || gtb.clientWidth,
        h = window.innerHeight || elm.clientHeight || gtb.clientHeight,
        time = Date.now();

      let docX = evt.pageX,
        docY = evt.pageY,
        winX = evt.clientX,
        winY = evt.clientY,
        docW = doc.body.clientWidth,
        docH = doc.body.clientWidth,
        winW = w,
        winH = h;

      let movementOutput = {
        type: 'MouseMovement',
        source: 'Window',
        url: doc.URL,
        x_win: winX,
        y_win: winY,
        w_win: winW,
        h_win: winH,
        x_doc: docX,
        y_doc: docY,
        w_doc: docW,
        h_doc: docH,
        localTimestamp: time,
      };

      // console.log(movementOutput);
      evt.currentTarget.storeService.postMouseCoordinates(movementOutput);
    }
  }

  scrollListener(evt) {
    if (true) {
      // From http://stackoverflow.com/a/23323821
      let win = evt.currentTarget.data.w,
        doc = evt.currentTarget.data.d,
        elm = evt.currentTarget.data.e,
        gtb = evt.currentTarget.data.g,
        w = window.innerWidth || elm.clientWidth || gtb.clientWidth,
        h = window.innerHeight || elm.clientHeight || gtb.clientHeight,
        time = Date.now();

      let scrollX = window.scrollX,
        scrollY = window.scrollY,
        docW = doc.body.clientWidth,
        docH = doc.body.clientWidth,
        winW = w,
        winH = h;

      let scrollOutput = {
        userId: 'userId',
        username: 'username',
        type: 'Scroll',
        source: 'Window',
        url: doc.URL,
        x_scr: scrollX,
        y_scr: scrollY,
        w_win: winW,
        h_win: winH,
        w_doc: docW,
        h_doc: docH,
        localTimestamp: time,
      };
      // console.log(scrollOutput);
      evt.currentTarget.storeService.postScroll(scrollOutput);
    }
  }
}
