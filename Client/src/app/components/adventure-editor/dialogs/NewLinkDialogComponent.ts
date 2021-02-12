import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-link-dialog',
  templateUrl: 'new-link-dialog.html',
  styleUrls: ['dialogs.scss'],
})
export class NewLinkDialogComponent {
  linkForm: FormGroup;
  targetNodes: any;
  nodes: any;
  node: any;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewLinkDialogComponent>
  ) {
    this.nodes = data.nodes;
    this.targetNodes = data.targetNodes;
    this.node = data.node;
    this.linkForm = this.formBuilder.group({
      label: [],
      source: [this.node.id],
      target: [],
      activators: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {}

  addNewLink() {
    console.log(this.linkForm.value);
    const newLink = this.linkForm.value;
    this.dialogRef.close({ newLink: newLink });
  }

  get activatorsArray() {
    return this.linkForm.get('activators') as FormArray;
  }

  addActivator() {
    const newActivator = this.formBuilder.group({
      node: '',
      condition: '',
    });

    this.activatorsArray.push(newActivator);
  }
  removeItem() {
    this.activatorsArray.removeAt(this.activatorsArray.length - 1);
  }
  removeLink(idx) {
    this.activatorsArray.removeAt(idx);
  }
}
