import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AnswerService } from 'src/app/services/game/answer.service';

@Component({
  selector: 'app-multiple-form',
  templateUrl: './multiple-form.component.html',
  styleUrls: ['./multiple-form.component.css'],
})
export class MultipleFormComponent implements OnInit {
  answerForm: FormGroup;

  @Input()
  adventure: any;

  @Input()
  currentNode: any;

  @Input()
  challenge;

  @Output()
  challengeFinishedEvent = new EventEmitter<boolean>();

  question: string;
  options: any;

  constructor(
    private formBuilder: FormBuilder,
    private answerService: AnswerService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.question = this.challenge.question;
    this.options = this.challenge.options;

    this.options.forEach((option) => {
      option.checked = false;
    });
    this.answerForm = this.formBuilder.group({
      answer: this.formBuilder.array([]),
      adventure: [this.adventure._id],
      user: [this.auth.getUser()._id],
      node: [this.currentNode._id],
      type: ["multiple"]
    });
    this.options.forEach((option) => {
      const newAnswer = this.formBuilder.group({
        value: option.value,
        checked: option.checked,
      });
      this.answersArray.push(newAnswer);
    });
  }

  get answersArray() {
    return this.answerForm.get('answer') as FormArray;
  }

  sendAnswer() {
    if (this.answerForm.valid) {
      const answer = this.answerForm.value;
      this.challengeFinishedEvent.emit(answer);
    } else {
      console.log('invalid answer form');
    }
  }

  fetchOptions() {}
}
