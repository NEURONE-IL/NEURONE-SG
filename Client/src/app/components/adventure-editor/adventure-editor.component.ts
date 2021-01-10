import { Component, OnInit, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { EditorService } from 'src/app/services/game/editor.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewNodeDialogComponent } from './NewNodeDialogComponent';
import { NewLinkDialogComponent } from './NewLinkDialogComponent';

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

