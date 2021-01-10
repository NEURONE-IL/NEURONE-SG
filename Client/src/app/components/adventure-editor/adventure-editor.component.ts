import { Component, Inject, OnInit, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { EditorService } from 'src/app/services/game/editor.service';
import { Subscription } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-adventure-editor',
  templateUrl: './adventure-editor.component.html',
  styleUrls: ['./adventure-editor.component.css'],
})
export class AdventureEditorComponent implements OnInit {
  updateGraph: Subject<boolean> = new Subject();
  @ViewChild('sidenav') nodeEditor: MatSidenav;
  nodeForm: FormGroup;
  nodeLinkForm: FormGroup;

  // Subscription for updating graph
  updateSubscription: Subscription;

  nodeTypes = [
    { value: 'initial', viewValue: 'Initial' },
    { value: 'transition', viewValue: 'Transition' },
    { value: 'ending', viewValue: 'Ending' },
    { value: 'question', viewValue: 'Question' },
    { value: 'evaluate', viewValue: 'Evaluate source' },
  ];

  constructor(
    public editorService: EditorService,
    private formBuilder: FormBuilder,
    public newNodeDialog: MatDialog,
    public newLinkDialog: MatDialog
  ) {
    // Subscribe to editor services messages
    this.updateSubscription = this.editorService
      .getRefreshRequest()
      .subscribe((value) => {
        if (value) {
          this.refreshGraph();
          this.closeEditor();
          this.closeDialogs();
        }
      });
  }

  ngOnInit(): void {
    this.nodeForm = this.formBuilder.group({
      id: [],
      label: [],
      type: [],
      data: this.formBuilder.group({
        image: [],
        text: [],
      }),
    });
  }

  closeEditor() {
    this.editorService.currentNode = null;
    this.nodeEditor.close();
  }

  closeDialogs() {
    this.newNodeDialog.closeAll();
    this.newLinkDialog.closeAll();
  }

  openEditor(node: any) {
    this.editorService.currentNode = node;
    this.nodeEditor.open();
  }

  updateNode() {
    this.editorService.updateNode(this.nodeForm.value);

    this.closeEditor();
    this.refreshGraph();
  }

  refreshGraph() {
    this.updateGraph.next(true);
  }

  getLinks() {
    return this.editorService.adventure.links;
  }

  showNewNodeForm(): void {
    this.newNodeDialog.open(NewNodeDialogComponent, {
      width: '250px',
      data: { node: this.editorService.adventure },
    });
  }

  showNewLinkDialog() {
    this.newLinkDialog.open(NewLinkDialogComponent, {
      width: '250px',
      data: {
        node: this.editorService.currentNode
      }
    });
  }
}
@Component({
  selector: 'app-new-node-dialog',
  templateUrl: 'dialogs/new-node-dialog.html',
})
export class NewNodeDialogComponent {

  newNodeForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public adventure: any,
    private formBuilder: FormBuilder
  ) {}

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
}

@Component({
  selector: 'app-new-link-dialog',
  templateUrl: 'dialogs/new-link-dialog.html',
})
export class NewLinkDialogComponent {

  linkForm: FormGroup;
  targetNodes: any;
  node: any;

  constructor(private formBuilder: FormBuilder,
              public editorService: EditorService) {}

  ngOnInit(): void {
    this.node = this.editorService.currentNode;
    this.targetNodes = this.editorService.getOtherNodes();
    console.log('target nodes: ',this.targetNodes);
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
