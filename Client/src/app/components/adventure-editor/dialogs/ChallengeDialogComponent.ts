import { Component, Inject, ɵConsole } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditorService } from 'src/app/services/game/editor.service';

@Component({
  selector: 'app-challenge-dialog',
  templateUrl: 'challenge-dialog.html',
  styleUrls: ['dialogs.scss'],
})
export class ChallengeDialogComponent {
  challengeForm: FormGroup;
  targetNodes: any;
  challenge: any;
  types: any;

  constructor(
    private formBuilder: FormBuilder,
    public editorService: EditorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChallengeDialogComponent>
  ) {
    const node = data.node;
    if (node.challenge) {
      this.challenge = node.challenge;
    } else {
      this.challenge = {
        type: 'question',
        question: "What's 10 + 15",
        answer: '25'
      };
    }
    this.challengeForm = this.formBuilder.group({
      type: [],
      question: [],
      answer: [],
      options: this.formBuilder.array([]),
    });
    this.types = [
      {
        value: 'question',
        viewValue: 'CHALLENGE_DIALOG.TYPES.QUESTION',
      },
      {
        value: 'multiple',
        viewValue: 'CHALLENGE_DIALOG.TYPES.MULTIPLE',
      },
    ];
    this.fetchOptions();
  }

  ngOnInit(): void {}

  saveChallenge() {
    let challenge = this.challengeForm.value;
    if(challenge.type == 'multiple') {
      delete challenge.answer;
    }
    if(challenge.type == 'question') {
      delete challenge.options;
    }
    this.dialogRef.close({ challenge: challenge });
  }

  updateType(type) {
    console.log(type);
    console.log(this.challengeForm.value);
    console.log("challenge: ",this.challenge);
  }

  addOption() {
    const newOption = this.formBuilder.group({value: 'New option', correct: false});
    this.optionsArray.push(newOption);
    console.log(this.challengeForm.value);
  }

  fetchOptions() {
    if(this.challenge.options) {
      this.challenge.options.forEach(option => {
        console.log(option);
        this.optionsArray.push(this.formBuilder.group(option));
      });
    }
  }

  get optionsArray() {
    return this.challengeForm.get('options') as FormArray;
  }
}
