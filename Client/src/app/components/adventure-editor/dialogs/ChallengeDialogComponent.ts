import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EditorService } from 'src/app/services/game/editor.service';

@Component({
  selector: 'app-challenge-dialog',
  templateUrl: 'challenge-dialog.html',
  styleUrls: ['dialogs.scss'],
})
export class ChallengeDialogComponent {

  challengeForm: FormGroup;
  targetNodes: any;
  node: any;

  constructor(private formBuilder: FormBuilder,
    public editorService: EditorService) { }

  ngOnInit(): void {
    this.node = this.editorService.currentNode;
    this.challengeForm = this.formBuilder.group({
      type: [],
      question: [],
      answer: [],
      options: []
    });
  }

  saveChallenge() {
    const challenge = this.challengeForm.value;
    this.editorService.updateChallenge(challenge);
  }
}
