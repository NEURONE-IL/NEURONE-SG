import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(
    private formBuilder: FormBuilder,
    public editorService: EditorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChallengeDialogComponent>
  ) {
    const node = data.node;
    console.log('challenge node: ', node)
    if (node.challenge) {
      this.challenge = node.challenge;
    }
    else {
      this.challenge = {
        type: "question",
        question: "What's 10 + 15",
        answer: "25"
      }
    }
    this.challengeForm = this.formBuilder.group({
      type: [],
      question: [],
      answer: [],
      options: [],
    });
  }

  ngOnInit(): void {}

  saveChallenge() {
    const challenge = this.challengeForm.value;
    this.dialogRef.close({ challenge: challenge });
  }
}
