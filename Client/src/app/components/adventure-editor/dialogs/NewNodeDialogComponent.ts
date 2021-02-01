import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditorService } from 'src/app/services/game/editor.service';

@Component({
  selector: 'app-new-node-dialog',
  templateUrl: 'new-node-dialog.html',
  styleUrls: ['dialogs.scss'],
})
export class NewNodeDialogComponent {
  newNodeForm: FormGroup;

  nodeTypes = [
    { value: 'transition', viewValue: 'Transition' },
    { value: 'ending', viewValue: 'Ending' },
    { value: 'question', viewValue: 'Question' },
    // { value: 'evaluate', viewValue: 'Evaluate source' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    public editorService: EditorService,
    public dialogRef: MatDialogRef<NewNodeDialogComponent>
  ) {}

  ngOnInit(): void {
    this.newNodeForm = this.formBuilder.group({
      label: ['', Validators.required],
      type: ['', Validators.required],
      data: this.formBuilder.group({
        image: [''],
        video: [''],
        text: ['', Validators.required],
      }),
    });
  }

  addNewNode() {
    const newNode = this.newNodeForm.value;
    this.dialogRef.close({ newNode: newNode });
  }
}
