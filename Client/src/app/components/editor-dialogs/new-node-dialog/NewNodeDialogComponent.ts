import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { EditorService } from 'src/app/services/game/editor.service';

@Component({
  selector: 'app-new-node-dialog',
  templateUrl: 'new-node-dialog.html',
  styleUrls: ['new-node-dialog.scss'],
})
export class NewNodeDialogComponent {
  newNodeForm: FormGroup;

  nodeTypes = [
    { value: 'transition', viewValue: 'EDITOR.NODE_EDITOR.TYPES.TRANSITION' },
    { value: 'ending', viewValue: 'EDITOR.NODE_EDITOR.TYPES.ENDING' },
    { value: 'challenge', viewValue: 'EDITOR.NODE_EDITOR.TYPES.CHALLENGE' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    public editorService: EditorService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<NewNodeDialogComponent>
  ) {}

  ngOnInit(): void {
    this.newNodeForm = this.formBuilder.group({
      label: ['', Validators.required],
      type: ['', Validators.required],
      data: this.formBuilder.group({
        image_filename: [''],
        image_id: [''],
        video: [''],
        text: ['', Validators.required],
      }),
    });
  }

  addNewNode() {
    const newNode = this.newNodeForm.value;
    if (newNode.type == 'challenge') {
      let defaultChallenge = {
        type: 'question',
        question: "What's 10 + 15",
        answer: '25',
      };

      this.translate.get('DEFAULT_CHALLENGE').subscribe(
        (res) => {
          if (res.QUESTION && res.ANSWER) {
            defaultChallenge.question = res.QUESTION;
            defaultChallenge.answer = res.ANSWER;
          }
        },
        (err) => {
          console.log('error fetching default challenge translations');
          console.log(err);
        }
      );

      newNode.challenge = defaultChallenge;
    }
    this.dialogRef.close({ newNode: newNode });
  }
}
