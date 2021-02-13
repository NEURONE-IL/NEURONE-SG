import { Component, OnDestroy, OnInit, Output } from '@angular/core';
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
import { nanoid } from 'nanoid';
import { LinksTableDialog } from './dialogs/LinksTableDialog';

@Component({
  selector: 'app-adventure-editor',
  templateUrl: './adventure-editor.component.html',
  styleUrls: ['./adventure-editor.component.scss'],
})
export class AdventureEditorComponent implements OnInit, OnDestroy {
  updateGraph: Subject<boolean> = new Subject();
  @ViewChild('sidenav') nodeEditor: MatSidenav;
  nodeForm: FormGroup;
  challengeForm: FormGroup;
  nodeLinkForm: FormGroup;

  adventure: any;
  currentNode: any;
  updating: boolean;

  nodeTypes: any;

  // Subscriptions to editor service
  updateSubscription: Subscription;
  updatingSubscription: Subscription;
  adventureSubscription: Subscription;
  currentNodeSubscription: Subscription;

  constructor(
    private editorService: EditorService,
    private formBuilder: FormBuilder,
    public newNodeDialog: MatDialog,
    public challengeDialog: MatDialog,
    public linksDialog: MatDialog,
  ) {
    this.updateSubscription = this.editorService
      .getRefreshRequest()
      .subscribe((value) => {
        if (value) {
          this.refreshGraph();
          this.closeEditor();
          this.closeDialogs();
        }
      });
    this.adventureSubscription = this.editorService.adventureEmitter.subscribe(
      (adventure) => {
        this.adventure = adventure;
      }
    );
    this.currentNodeSubscription = this.editorService.currentNodeEmitter.subscribe(
      (node) => {
        this.currentNode = node;
      }
    );
    this.updatingSubscription = this.editorService.updatingEmitter.subscribe(
      (updating) => {
        this.updating = updating;
      }
    );
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
        text: [],
      }),
    });
    this.nodeTypes = [
      { value: 'initial', viewValue: 'EDITOR.NODE_EDITOR.TYPES.INITIAL' },
      { value: 'transition', viewValue: 'EDITOR.NODE_EDITOR.TYPES.TRANSITION' },
      { value: 'ending', viewValue: 'EDITOR.NODE_EDITOR.TYPES.ENDING' },
      { value: 'challenge', viewValue: 'EDITOR.NODE_EDITOR.TYPES.CHALLENGE' },
    ];
  }

  ngOnDestroy(): void {
    this.adventureSubscription.unsubscribe();
    this.currentNodeSubscription.unsubscribe();
    this.updatingSubscription.unsubscribe();
    this.updateSubscription.unsubscribe();
    this.closeDialogs();
  }

  closeEditor() {
    this.editorService.currentNode = null;
    if (this.nodeEditor) {
      this.nodeEditor.close();
    }
  }

  closeDialogs() {
    if (this.newNodeDialog) this.newNodeDialog.closeAll();
    if (this.challengeDialog) this.challengeDialog.closeAll();
    if (this.linksDialog) this.linksDialog.closeAll();
  }

  openEditor(node: any) {
    this.editorService.setCurrentNode(node);
    this.nodeEditor.open();
  }

  updateNode() {
    const newNode = this.nodeForm.value;
    if(this.nodeForm.valid) {
      this.nodes.forEach((node, index) => {
        if (node.id == this.currentNode.id) {
          this.nodes[index] = newNode;
        }
      });
      this.links.forEach((link, index) => {
        if (link.source == this.currentNode.id) {
          link.source = newNode.id;
        }
        if (link.target == this.currentNode.id) {
          link.target = newNode.id;
        }
      });

      this.editorService.setAdventure(this.adventure);
      console.log(this.adventure);
      this.closeEditor();
      this.refreshGraph();
    }
  }

  addNode(newNode) {
    newNode.id = nanoid(13);
    this.nodes.push(newNode);
    this.refreshGraph();
  }

  refreshGraph() {
    this.closeDialogs();
    this.closeEditor();
    this.updateGraph.next(true);
    console.log(this.adventure);
  }

  showNewNodeForm(): void {
    const nodeDialogRef = this.newNodeDialog.open(NewNodeDialogComponent, {
      width: '400px',
      data: { node: this.editorService.adventure },
    });

    nodeDialogRef.afterClosed().subscribe((result) => {
      console.log('closed nodeDialog');
      if (result.newNode) {
        console.log('new node: ', result.newNode);
        this.addNode(result.newNode);
      }
    });
  }

  showLinksDialog() {
    const linksDialogRef = this.linksDialog.open(LinksTableDialog, {
      width: '70rem',
      data: {
        links: this.adventure.links,
        nodes: this.nodes,
        node: this.currentNode,
        targetNodes: this.targetNodes,
      },
    });

    linksDialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result.links) {
        this.adventure.links = result.links;
        this.refreshGraph();
      }
    },
    (err) => {
      console.log(err);
    });
  }

  showChallengeDialog() {
    const challengeDialogRef = this.challengeDialog.open(
      ChallengeDialogComponent,
      {
        width: '400px',
        data: {
          node: this.currentNode,
        },
      }
    );

    challengeDialogRef.afterClosed().subscribe((result) => {
      if (result.challenge) {
        console.log('closed challengeDialog');
        console.log('challenge: ', result.challenge);
        this.currentNode.challenge = result.challenge;
      }
    });
  }

  updateNodeType(type) {
    this.currentNode.type = type;
    console.log(this.currentNode);
  }

  get nodes() {
    return this.adventure.nodes;
  }

  get links() {
    return this.adventure.links;
  }

  get targetNodes() {
    return this.adventure.nodes.filter((node) => this.currentNode != node);
  }
}
