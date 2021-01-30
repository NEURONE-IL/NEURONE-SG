import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnswerService } from 'src/app/services/game/answer.service';

@Component({
  selector: 'app-synthesis-form',
  templateUrl: './synthesis-form.component.html',
  styleUrls: ['./synthesis-form.component.css']
})
export class SynthesisFormComponent implements OnInit {

  answerForm: FormGroup;
  adventure: any;

  constructor(private formBuilder: FormBuilder,
              private answerService: AnswerService) { }

  ngOnInit(): void {
    this.answerForm = this.formBuilder.group({
      answer: ["", Validators.required],
      adventure: [this.adventure._id],
      // user: [this.authService.user._id],
      user: [Validators.required],
      node: [Validators.required],
      type: [""]
    });
  }

  sendAnswer() {
    console.log(this.answerForm.value);
  }
}
