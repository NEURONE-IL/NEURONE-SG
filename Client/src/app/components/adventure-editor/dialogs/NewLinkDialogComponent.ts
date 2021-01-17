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
  node: any;
  activatorItems: Array<string>;

  constructor(
    private formBuilder: FormBuilder,
    public editorService: EditorService
  ) {}

  ngOnInit(): void {
    this.activatorItems = [];
    this.node = this.editorService.currentNode;
    this.targetNodes = this.editorService.getOtherNodes();
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
    this.editorService.addLink(this.linkForm.value);
  }

  get activatorsArray() {
    return this.linkForm.get('activators') as FormArray;
  }

  addActivator() {
    this.activatorItems.push('');
    this.activatorsArray.push(this.formBuilder.control(''));
  }
  removeItem() {
    this.activatorItems.pop();
    this.activatorsArray.removeAt(this.activatorsArray.length - 1);
  }
}
