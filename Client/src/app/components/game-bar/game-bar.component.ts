import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from '../../services/game/game.service';
import { AnswerService } from '../../services/game/answer.service';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-game-bar',
  templateUrl: './game-bar.component.html',
  styleUrls: ['./game-bar.component.scss']
})
export class GameBarComponent implements OnInit {

  answerForm: FormGroup;

  constructor(public gameService: GameService,
              public searchService: SearchService,
              private formBuilder: FormBuilder,
              private answerService: AnswerService) { }

  ngOnInit(): void {
    this.answerForm = this.formBuilder.group({
      answer: ["", Validators.required],
      adventure: [this.gameService.adventure._id],
      // user: [this.authService.user._id],
      user: ["5ff90042eace08b452d92d63"],
      node: [this.gameService.currentNode._id],
      type: [this.gameService.currentNode.type]
    });
  }

  refresh() {
    window.location.reload();
  }

  sendAnswer() {
    if(this.answerForm.valid) {
      const answer = this.answerForm.value;
      this.answerService.postAnswer(answer).subscribe((res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      });
    }
    else {
      console.log('invalid answer form');
    }
  }

}
