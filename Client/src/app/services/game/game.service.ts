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

  // Activators
  activators = [];

  // Relevant resources visited
  relevantDocsVisited = [];

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
    return Promise.resolve(1);
  }

  reset() {
    this.loading = true;
    this.adventure = undefined;
    this.player = undefined;
    this.currentNode = undefined;
    this.activators = [];
    this.relevantDocsVisited = [];
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

  checkRelevantDoc(doc) {
    if (doc) {
      const docDomain = doc.domain ? doc.domain : undefined;
      const docTask = doc.task ? doc.task : undefined;

      const domain = this.adventure._id;
      const task = this.currentNode.id;

      if (docDomain == domain && docTask == task) {
        console.log('RELEVANT');
        if (
          !this.relevantDocsVisited.some((visitedDoc) => {
            return visitedDoc._id == doc._id;
          })
        ) {
          this.relevantDocsVisited.push(doc);
          if (
            !this.activators.some((activator) => {
              return activator.condition == 'relevant_links';
            })
          ) {
            let relevantLinksActivator = {
              condition: 'relevant_links',
              links_count: 1,
            };
            this.pushActivator(relevantLinksActivator);
          } else {
            let currentActivator = this.activators.find(
              (activator) => activator.condition == 'relevant_links'
            );
            currentActivator.links_count++;
          }
        }
      } else {
        console.log('NOT RELEVANT');
      }
      console.log(this.activators);
    }
  }

  pushActivator(activator) {
    if (
      activator.condition == 'wrong_answer' ||
      activator.condition == 'correct_answer'
    ) {
      let found = this.activators.some((currentActivator, idx) => {
        return (
          (activator.condition == 'wrong_answer' ||
            activator.condition == 'correct_answer') &&
          currentActivator.node == activator.node
        );
      });
      if (!found) {
        this.activators.push(activator);
      } else {
        if (activator.condition == 'correct_answer') {
          let wrongIdx = this.activators.findIndex(
            (a) => a.condition == 'wrong_answer' && a.node == activator.node
          );
          console.log('wrongIdx: ', wrongIdx);
          if (wrongIdx >= 0) {
            console.log('wrongIdx inside: ', wrongIdx);
            this.activators.splice(wrongIdx, 1);
            this.activators.push(activator);
          }
        }
      }
    } else {
      this.activators.push(activator);
    }
    console.log(this.activators);
  }

  pushLevelActivator(level) {
    const levelActivator = {
      condition: 'level',
      level: level,
    };
    if (
      !this.activators.some((activator) => {
        return activator.condition == 'level';
      })
    ) {
      this.pushActivator(levelActivator);
    } else {
      this.activators.forEach((activator, i) => {
        if (activator.condition == 'level') {
          this.activators.splice(i, 1);
          this.pushActivator(levelActivator);
        }
      });
    }
  }

  async fetchGMStats() {
    if (this.player.role == 'player') {
      let gmStats = {
        gmEnabled: true,
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
          gmStats.gmEnabled = false;
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
          gmStats.gmEnabled = false;
          console.log(err);
        });

      this.gmStats = gmStats;
      if (gmStats.currentLevel) {
        console.log('level: ', gmStats.currentLevel.level.code);
        const level = gmStats.currentLevel.level.code;
        this.pushLevelActivator(level);
      }
      this.gmStatsEmitChange(this.gmStats);
      console.log('gmStats: ', this.gmStats);
    } else {
      console.log('Current user is not a player (Gamification not activated)');
      let gmStats = {
        gmEnabled: false,
      };
      this.gmStats = gmStats;
      this.gmStatsEmitChange(this.gmStats);
      console.log('gmStats: ', this.gmStats);
    }
  }
}
