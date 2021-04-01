import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from '../../services/game/game.service';
import { AnswerService } from '../../services/game/answer.service';
import { SearchService } from '../../services/search/search.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import ActivatorsUtils from '../../utils/activators';

@Component({
  selector: 'app-game-bar',
  templateUrl: './game-bar.component.html',
  styleUrls: ['./game-bar.component.scss'],
})
export class GameBarComponent implements OnInit, OnDestroy {
  player: any;
  currentNode: any;
  searchEnabled: any;
  adventure: any;
  answerForm: FormGroup;
  challengePending = false;
  currentLinks = [];
  gmStats: any;

  // Subscriptions
  adventureSubscription: Subscription;
  currentNodeSubscription: Subscription;
  searchEnabledSubscription: Subscription;
  gmStatsSubscription: Subscription;

  constructor(
    private gameService: GameService,
    public searchService: SearchService,
    private formBuilder: FormBuilder,
    private answerService: AnswerService,
    private auth: AuthService,
    public router: Router
  ) {
    // Subscribe to current adventure
    this.adventureSubscription = this.gameService.adventureEmitter.subscribe(
      (adventure) => {
        this.adventure = adventure;
      }
    );
    // Subscribe to current node
    this.currentNodeSubscription = this.gameService.currentNodeEmitter.subscribe(
      (node) => {
        this.currentNode = node;
        if (this.currentNode.type == 'challenge') {
          this.challengePending = true;
        } else {
          this.setCurrentLinks();
        }
      }
    );
    // Subscribe to search enabled boolean
    this.searchEnabledSubscription = this.searchService.searchEnabledEmitter.subscribe(
      (searchEnabled) => {
        this.searchEnabled = searchEnabled;
      }
    );
    // Subscribe to gamification resources
    this.gmStatsSubscription = this.gameService.gmStatsEmitter.subscribe(
      (gmStats) => {
        this.gmStats = gmStats;
        this.setCurrentLinks();
      }
    )
  }

  ngOnInit(): void {
    this.player = this.auth.getUser();
    this.answerForm = this.formBuilder.group({
      answer: ['', Validators.required],
      adventure: [this.adventure._id],
      user: [Validators.required],
      node: [Validators.required],
      type: [''],
    });
  }

  ngOnDestroy(): void {
    this.adventureSubscription.unsubscribe();
    this.currentNodeSubscription.unsubscribe();
    this.searchEnabledSubscription.unsubscribe();
    this.gmStatsSubscription.unsubscribe();
  }

  finish() {
    this.router.navigate(['select']);
  }

  finishChallenge(answer) {
    this.answerService.postAnswer(answer).subscribe(
      (res) => {
        console.log(res);
        if (res.activator) {
          this.gameService.pushActivator(res.activator);
        }
        this.gameService.fetchGMStats();
        this.setCurrentLinks();
        this.challengePending = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  setCurrentLinks() {
    console.log('getCurrentLinks called');
    console.log('all links:',this.links);
    let currentLinks = this.links.filter(
      (link) => link.source == this.currentNode.id
    );
    console.log('pre links:',currentLinks);
    this.currentLinks = ActivatorsUtils.checkActivators(
      currentLinks,
      this.gameService.activators
    );
    console.log('post links:',this.currentLinks);
  }

  goTo(targetNodeId) {
    this.gameService.setCurrentNode(targetNodeId);
  }

  get links() {
    return this.adventure.links;
  }

  get currentChallenge() {
    return this.currentNode.challenge;
  }

  get playerLevel() {
    try {
      return this.gmStats.currentLevel.level.name;
    } catch (error) {
      return undefined;
    }
  }

  get playerPoints() {
    try {
      return this.gmStats.points[0].amount;
    } catch (error) {
      return undefined;
    }
  }

  toggleSearch() {
    this.searchService.toggleSearch();
  }
}
