import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { AdventureService } from '../../services/game/adventure.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // Adventure
  adventure: any;
  adventureSubject = new ReplaySubject<any>(1);
  adventureEmitter = this.adventureSubject.asObservable();

  // Player data
  player: any;

  // Current node
  currentNode: any;
  currentNodeSubject = new ReplaySubject<any>(1);
  currentNodeEmitter = this.currentNodeSubject.asObservable();

  // Loading boolean
  loading = true;
  loadingSubject = new ReplaySubject<any>(1);
  loadingEmitter = this.loadingSubject.asObservable();

  constructor(public adventureService: AdventureService,
    private auth: AuthService) {
  }

  async init(adventure) {
    this.reset();
    this.setAdventure(adventure);
    this.setInitialNode();
    this.player = this.auth.getUser();
    await new Promise(r => setTimeout(r, 1000));
    this.setLoading(false);
    console.log('init complete');
    return Promise.resolve(1);
  }

  reset() {
    this.adventure = undefined;
    this.player = undefined;
    this.loading = true;
    this.currentNode = undefined;
    this.adventureEmitChange(this.adventure);
    this.loadingEmitChange(this.loading);
    this.currentNodeEmitChange(this.currentNode);
  }

  private setLoading(value: boolean) {
    this.loading = value;
    this.loadingEmitChange(this.loading);
  }

  private setAdventure(adventure: any) {
    this.adventure = adventure;
    this.adventureEmitChange(this.adventure);
  }

  setCurrentNode(targetNodeId) {
    this.currentNode = this.nodes.find(node => node.id==targetNodeId);
    this.currentNodeEmitChange(this.currentNode);
  }

  setInitialNode() {
    this.currentNode = this.nodes.find(node => node.type="initial");
    this.currentNodeEmitChange(this.currentNode);
  }

  setPlayer(player) {
    this.player = player;
    // TODO: add emitter
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

  get links() {
    return this.adventure.links;
  }

  get nodes() {
    return this.adventure.nodes;
  }


}
