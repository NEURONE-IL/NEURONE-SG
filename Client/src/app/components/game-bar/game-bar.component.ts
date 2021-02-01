import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from '../../services/game/game.service';
import { AnswerService } from '../../services/game/answer.service';
import { SearchService } from '../../services/search/search.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-bar',
  templateUrl: './game-bar.component.html',
  styleUrls: ['./game-bar.component.scss'],
})
export class GameBarComponent implements OnInit, OnDestroy {
  player: any;
  currentNode: any;
  adventure: any;
  answerForm: FormGroup;
  challengePending = false;

  adventureSubscription: Subscription;
  currentNodeSubscription: Subscription;

  constructor(
    private gameService: GameService,
    public searchService: SearchService,
    private formBuilder: FormBuilder,
    private answerService: AnswerService,
    private auth: AuthService,
    public router: Router
  ) {
    this.adventureSubscription = this.gameService.adventureEmitter.subscribe(
      (adventure) => {
        this.adventure = adventure;
        console.log('gameBar adventure: ', this.adventure);
      }
    );
    this.currentNodeSubscription = this.gameService.currentNodeEmitter.subscribe(
      (node) => {
        this.currentNode = node;
        if (this.currentNode.type == 'challenge') {
          console.log('challenge node!');
          this.challengePending = true;
        }
        console.log('gameBar currentNode: ', this.currentNode);
      }
    );
  }

  ngOnInit(): void {
    this.player = this.auth.getUser();
    this.answerForm = this.formBuilder.group({
      answer: ['', Validators.required],
      adventure: [this.gameService.adventure._id],
      // user: [this.authService.user._id],
      user: [Validators.required],
      node: [Validators.required],
      type: [''],
    });
  }

  ngOnDestroy(): void {
    this.adventureSubscription.unsubscribe();
    this.currentNodeSubscription.unsubscribe();
  }

  finish() {
    this.router.navigate(['select']);
  }

  sendAnswer() {
    if (this.answerForm.valid) {
      this.answerForm.controls['node'].setValue(
        this.gameService.currentNode._id
      );
      this.answerForm.controls['user'].setValue('5ff90042eace08b452d92d63');
      this.answerForm.controls['type'].setValue('question');
      const answer = this.answerForm.value;
      console.log(answer);
      this.answerService.postAnswer(answer).subscribe(
        (res) => {
          console.log(res);
          this.gameService.activators.push(res);
          this.challengePending = false;
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      console.log('invalid answer form');
    }
  }

  getCurrentLinks() {
    let currentLinks = this.links.filter(
      (link) => link.source == this.currentNode.id
    );
    // this.checkActivators(currentLinks);
    return currentLinks;
  }

  private checkActivators(currentLinks: any) {
    for (let i = currentLinks.length - 1; i >= 0; i--) {
      if ('activators' in currentLinks[i]) {
        if (currentLinks[i].activators.length > 0) {
          if (
            !currentLinks[i].activators.some((r) => this.activators.includes(r))
          ) {
            currentLinks.splice(i, 1);
          }
        }
      }
    }
  }

  getCurrentChallenge() {
    return this.currentNode.challenge;
  }

  goTo(targetNodeId) {
    this.gameService.setCurrentNode(targetNodeId);
  }

  get links() {
    return this.adventure.links;
  }

  get activators() {
    return this.currentNode.activators;
  }
}
