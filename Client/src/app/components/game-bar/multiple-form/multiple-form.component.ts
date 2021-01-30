import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnswerService } from 'src/app/services/game/answer.service';

@Component({
  selector: 'app-multiple-form',
  templateUrl: './multiple-form.component.html',
  styleUrls: ['./multiple-form.component.css'],
})
export class MultipleFormComponent implements OnInit {
  answerForm: FormGroup;
  adventure: any;
  question: string;
  options: any;

  constructor(
    private formBuilder: FormBuilder,
    private answerService: AnswerService
  ) {}

  ngOnInit(): void {
    this.question =
      '¿Cuales son las 3 ideas principales de la canción **********?';
    this.options = [
      { value: 'Libertad', checked: false },
      { value: 'Liderazgo', checked: false },
      { value: 'Paz', checked: false },
      { value: 'Diversión', checked: false },
      { value: 'Compartir', checked: false },
    ];
    this.answerForm = this.formBuilder.group({
        answers: this.formBuilder.array([])
      // answer: ["", Validators.required],
      // adventure: [this.adventure._id],
      // user: [this.authService.user._id],
      // user: [Validators.required],
      // node: [Validators.required],
      // type: [""]
    });
  }

  get answersArray() {
    return this.answerForm.get('answers') as FormArray;
  }

  sendAnswer() {

    const newActivator = this.formBuilder.group({
      node: '',
      condition: ''
    });

    this.options.forEach(option => {
      if (option.checked) {
        const newAnswer = this.formBuilder.control(option.value);
        this.answersArray.push(newAnswer);
      }
    });
    console.log(this.answerForm.value);
  }
}
