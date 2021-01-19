import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { EditorService } from 'src/app/services/game/editor.service';

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
    public editorService: EditorService
  ) {}

  ngOnInit(): void {
    this.node = this.editorService.currentNode;
    this.targetNodes = this.editorService.otherNodes;
    this.nodes = this.editorService.nodes;
    this.nodes.push({id: undefined, label: 'No node'});
    console.log('target nodes: ', this.targetNodes);
    this.linkForm = this.formBuilder.group({
      label: [],
      source: [this.node.id],
      target: [],
      activators: this.formBuilder.array([]),
    });
  }

  addNewLink() {
    console.log(this.linkForm.value);
    // this.editorService.addLink(this.linkForm.value);
  }

  get activatorsArray() {
    return this.linkForm.get('activators') as FormArray;
  }

  addActivator() {
    const newActivator = this.formBuilder.group({
      node: '',
      condition: ''
    });

    this.activatorsArray.push(newActivator);
  }
  removeItem() {
    this.activatorsArray.removeAt(this.activatorsArray.length - 1);
  }
}
