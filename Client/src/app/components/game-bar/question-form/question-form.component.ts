import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AnswerService } from 'src/app/services/game/answer.service';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit {
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

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.question = this.challenge.question;

    this.answerForm = this.formBuilder.group({
      answer: ['', Validators.required],
      adventure: [this.adventure._id],
      user: [this.auth.getUser()._id],
      node: [this.currentNode._id],
      type: ["question"]
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
}
