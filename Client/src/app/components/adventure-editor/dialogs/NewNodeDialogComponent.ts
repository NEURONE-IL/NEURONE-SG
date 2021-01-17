import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    @Inject(MAT_DIALOG_DATA) public adventure: any,
    private formBuilder: FormBuilder,
    public editorService: EditorService
  ) { }

  ngOnInit(): void {
    this.newNodeForm = this.formBuilder.group({
      id: [],
      label: [Validators.required],
      type: [Validators.required],
      data: this.formBuilder.group({
        image: [],
        video: [],
        text: [Validators.required],
      }),
    });
  }

  addNewNode() {
    this.editorService.addNode(this.newNodeForm.value);
  }
}
