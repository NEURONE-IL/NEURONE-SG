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

  // Subscriptions to editor service
  updateSubscription: Subscription;
  updatingSubscription: Subscription;
  adventureSubscription: Subscription;
  currentNodeSubscription: Subscription;

  nodeTypes = [
    { value: 'transition', viewValue: 'Transition' },
    { value: 'ending', viewValue: 'Ending' },
    { value: 'challenge', viewValue: 'Challenge' },
  ];

  constructor(
    private editorService: EditorService,
    private formBuilder: FormBuilder,
    public newNodeDialog: MatDialog,
    public newLinkDialog: MatDialog,
    public challengeDialog: MatDialog
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
  }

  ngOnDestroy(): void {
    this.adventureSubscription.unsubscribe();
    this.currentNodeSubscription.unsubscribe();
    this.updatingSubscription.unsubscribe();
    this.updateSubscription.unsubscribe();
  }

  closeEditor() {
    this.editorService.currentNode = null;
    if (this.nodeEditor) {
      this.nodeEditor.close();
    }
  }

  closeDialogs() {
    if (this.newNodeDialog) this.newNodeDialog.closeAll();
    if (this.newLinkDialog) this.newLinkDialog.closeAll();
    if (this.challengeDialog) this.challengeDialog.closeAll();
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
      this.closeEditor();
      this.refreshGraph();
    }
  }

  addLink(newLink) {
    if ('activators' in newLink) {
      if (newLink.activators.length == 0) {
        delete newLink.activators;
      }
    }
    this.links.push(newLink);
    this.refreshGraph();
  }

  addNode(newNode) {
    newNode.id = nanoid(13);
    this.nodes.push(newNode);
    this.refreshGraph();
  }

  refreshGraph() {
    this.updateGraph.next(true);
  }

  showNewNodeForm(): void {
    const nodeDialogRef = this.newNodeDialog.open(NewNodeDialogComponent, {
      width: '250px',
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

  showNewLinkDialog() {
    const linkDialogRef = this.newLinkDialog.open(NewLinkDialogComponent, {
      width: '250px',
      data: {
        nodes: this.nodes,
        node: this.currentNode,
        targetNodes: this.targetNodes,
      },
    });

    linkDialogRef.afterClosed().subscribe((result) => {
      console.log('closed linkDialog');
      if (result.newLink) {
        console.log('new link: ', result.newLink);
        this.addLink(result.newLink);
      }
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
