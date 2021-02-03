import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { Subject } from 'rxjs';
import { AdventureService } from './adventure.service';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  // Adventure
  adventure: any;
  adventureSubject = new ReplaySubject<any>(1);
  adventureEmitter = this.adventureSubject.asObservable();

  // Current node
  currentNode: any;
  currentNodeSubject = new ReplaySubject<any>(1);
  currentNodeEmitter = this.currentNodeSubject.asObservable();

  // Loading boolean
  loading = true;
  loadingSubject = new ReplaySubject<any>(1);
  loadingEmitter = this.loadingSubject.asObservable();

  // Updating boolean
  updating = true;
  updatingSubject = new ReplaySubject<any>(1);
  updatingEmitter = this.updatingSubject.asObservable();

  private refreshGraphSubject = new Subject<any>();

  constructor(private adventureService: AdventureService,
              public router: Router) {
  }

  async init(adventure) {
    this.reset();
    this.setAdventure(adventure);
    await new Promise(r => setTimeout(r, 1000));
    this.setLoading(false);
    this.setUpdating(false);
    console.log('editor service init complete');
    return Promise.resolve(1);
  }

  reset() {
    this.adventure = undefined;
    this.currentNode = undefined;
    this.loading = true;
    this.adventureEmitChange(this.adventure);
    this.currentNodeEmitChange(this.currentNode);
    this.loadingEmitChange(this.loading);
  }

  setAdventure(adventure: any) {
    this.adventure = adventure;
    this.adventureEmitChange(adventure);
  }

  setLoading(value: boolean) {
    this.loading = value;
    this.loadingEmitChange(this.loading);
  }

  setCurrentNode(node) {
    this.currentNode = node;
    this.currentNodeEmitChange(this.currentNode);
  }

  setUpdating(value: boolean) {
    this.updating = value;
    this.updatingEmitChange(this.updating);
  }

  get currentNodeLinks() {
    return this.adventure.links.filter(link => link.source==this.currentNode.id);
  }

  get name() {
    return this.adventure.name;
  }

  get description() {
    return this.adventure.description;
  }

  updateMeta(newMeta) {
    this.adventure.name = newMeta.name;
    this.adventure.description = newMeta.description;
    this.adventureEmitChange(this.adventure);
  }

  updateChallenge(newChallenge) {
    this.currentNode.challenge = newChallenge;
    this.refreshGraphSubject.next(true);
  }

  getRefreshRequest(): Observable<any> {
    return this.refreshGraphSubject.asObservable();
  }

  updateAdventure() {
    this.adventureService.updateAdventure(this.adventure).subscribe((res) => {
      this.adventureEmitChange(this.adventure);
      this.setUpdating(false);
      this.refreshGraphSubject.next(true);
    },
    (err) => {
      console.log(err);
    });
  }

  adventureEmitChange(adv: any) {
    this.adventureSubject.next(adv);
  }

  currentNodeEmitChange(node: any) {
    this.currentNodeSubject.next(node);
  }

  loadingEmitChange(loading: any) {
    this.loadingSubject.next(loading);
  }

  updatingEmitChange(updating: any) {
    this.updatingSubject.next(updating);
  }
}
