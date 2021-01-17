import { Component, OnInit, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { EditorService } from 'src/app/services/game/editor.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewNodeDialogComponent } from './dialogs/NewNodeDialogComponent';
import { NewLinkDialogComponent } from './dialogs/NewLinkDialogComponent';
import { ChallengeDialogComponent } from './dialogs/ChallengeDialogComponent';

@Component({
  selector: 'app-adventure-editor',
  templateUrl: './adventure-editor.component.html',
  styleUrls: ['./adventure-editor.component.scss'],
})
export class AdventureEditorComponent implements OnInit {
  updateGraph: Subject<boolean> = new Subject();
  @ViewChild('sidenav') nodeEditor: MatSidenav;
  nodeForm: FormGroup;
  challengeForm: FormGroup;
  nodeLinkForm: FormGroup;

  // Subscription for updating graph
  updateSubscription: Subscription;

  nodeTypes = [
    // { value: 'initial', viewValue: 'Initial' },
    { value: 'transition', viewValue: 'Transition' },
    { value: 'ending', viewValue: 'Ending' },
    { value: 'challenge', viewValue: 'Challenge' }
    // { value: 'evaluate', viewValue: 'Evaluate source' },
  ];

  constructor(
    public editorService: EditorService,
    private formBuilder: FormBuilder,
    public newNodeDialog: MatDialog,
    public newLinkDialog: MatDialog,
    public challengeDialog: MatDialog
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
      challenge: [],
      data: this.formBuilder.group({
        image: [],
        video: [],
        text: []
      })
    });
  }

  closeEditor() {
    this.editorService.currentNode = null;
    if(this.nodeEditor) {
      this.nodeEditor.close();
    }
  }

  closeDialogs() {
    if(this.newNodeDialog) this.newNodeDialog.closeAll();
    if(this.newLinkDialog) this.newLinkDialog.closeAll();
    if(this.challengeDialog) this.challengeDialog.closeAll();
  }

  openEditor(node: any) {
    this.editorService.currentNode = node;
    console.log(node);
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

  showChallengeDialog() {
    this.challengeDialog.open(ChallengeDialogComponent, {
      width: '400px',
      data: {
        node: this.editorService.currentNode
      }
    });
  }
}

