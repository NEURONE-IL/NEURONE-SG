import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EditorService } from 'src/app/services/game/editor.service';

@Component({
  selector: 'app-new-link-dialog',
  templateUrl: 'dialogs/new-link-dialog.html',
})
export class NewLinkDialogComponent {

  linkForm: FormGroup;
  targetNodes: any;
  node: any;

  constructor(private formBuilder: FormBuilder,
    public editorService: EditorService) { }

  ngOnInit(): void {
    this.node = this.editorService.currentNode;
    this.targetNodes = this.editorService.getOtherNodes();
    console.log('target nodes: ', this.targetNodes);
    this.linkForm = this.formBuilder.group({
      label: [],
      source: [this.node.id],
      target: []
    });
  }

  addNewLink() {
    this.editorService.addLink(this.linkForm.value);
  }
}
