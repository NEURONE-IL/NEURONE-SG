import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { AdventureService } from '../../services/game/adventure.service';
import { AuthService } from '../auth/auth.service';
import { GamificationService } from './gamification.service';

@Injectable({
  providedIn: 'root',
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

  // Gamification resources
  gmStats: any;
  gmStatsSubject = new ReplaySubject<any>(1);
  gmStatsEmitter = this.gmStatsSubject.asObservable();

  constructor(
    public adventureService: AdventureService,
    private auth: AuthService,
    private gmService: GamificationService
  ) {}

  async init(adventure) {
    this.reset();
    this.setAdventure(adventure);
    this.setInitialNode();
    this.player = this.auth.getUser();
    await this.fetchGMStats();
    await new Promise((r) => setTimeout(r, 1000));
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
    this.currentNode = this.nodes.find((node) => node.id == targetNodeId);
    this.currentNodeEmitChange(this.currentNode);
  }

  setInitialNode() {
    this.currentNode = this.nodes.find((node) => (node.type = 'initial'));
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

  gmStatsEmitChange(gmStats: any) {
    this.gmStatsSubject.next(gmStats);
  }

  get links() {
    return this.adventure.links;
  }

  get nodes() {
    return this.adventure.nodes;
  }

  async fetchGMStats() {
    if (this.player.role == 'player') {
      let gmStats = {
        currentLevel: null,
        points: null,
      };

      await this.gmService
        .userLevel(this.player._id)
        .toPromise()
        .then((res) => {
          let levels = res;
          gmStats.currentLevel = levels[0];
          for (let i = 0; i < levels.length; i++) {
            if (
              levels[i].point_threshold < gmStats.currentLevel.point_threshold
            ) {
              gmStats.currentLevel = levels[i];
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });

      await this.gmService
        .userPoints(this.player._id)
        .toPromise()
        .then((res) => {
          let points = res;
          gmStats.points = points;
        })
        .catch((err) => {
          console.log(err);
        });

      this.gmStats = gmStats;
      this.gmStatsEmitChange(this.gmStats);
      console.log('gmStats: ', this.gmStats);
    }
    else {
      console.log('Current user is not a player (Gamification not activated)');
    }
  }
}
