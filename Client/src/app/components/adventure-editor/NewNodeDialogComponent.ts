import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditorService } from 'src/app/services/game/editor.service';

@Component({
  selector: 'app-new-node-dialog',
  templateUrl: 'dialogs/new-node-dialog.html',
})
export class NewNodeDialogComponent {

  newNodeForm: FormGroup;

  nodeTypes = [
    { value: 'initial', viewValue: 'Initial' },
    { value: 'transition', viewValue: 'Transition' },
    { value: 'ending', viewValue: 'Ending' },
    { value: 'question', viewValue: 'Question' },
    { value: 'evaluate', viewValue: 'Evaluate source' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public adventure: any,
    private formBuilder: FormBuilder,
    public editorService: EditorService
  ) { }

  ngOnInit(): void {
    this.newNodeForm = this.formBuilder.group({
      id: [],
      label: [],
      type: [],
      data: this.formBuilder.group({
        image: [],
        text: [],
      }),
    });
  }

  addNewNode() {
    this.editorService.addNode(this.newNodeForm.value);
  }
}
