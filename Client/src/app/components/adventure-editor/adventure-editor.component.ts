import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { EditorService } from 'src/app/services/game/editor.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewNodeDialogComponent } from '../editor-dialogs/new-node-dialog/NewNodeDialogComponent';
import { ChallengeDialogComponent } from '../editor-dialogs/challenge-dialog/ChallengeDialogComponent';
import { nanoid } from 'nanoid';
import { LinksTableDialog } from '../editor-dialogs/links-table-dialog/LinksTableDialog';
import { WebResourcesTableDialogComponent } from '../web-resources-dialogs/web-resources-table-dialog/web-resources-table-dialog.component';
import { ImageService } from 'src/app/services/game/image.service';
import { environment } from 'src/environments/environment';

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
  initialType: any;
  mediaTypes: any;
  currentMediaType: string;
  currentImg: string;

  apiUrl = environment.apiUrl;

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
    public webDialog: MatDialog,
    private imageService: ImageService
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
    this.currentMediaType = 'none';
    this.nodeForm = this.formBuilder.group({
      id: [],
      label: [],
      type: [],
      challenge: [],
      data: this.formBuilder.group({
        image_id: [],
        video: [],
        text: [],
      }),
    });
    this.nodeTypes = [
      { value: 'transition', viewValue: 'EDITOR.NODE_EDITOR.TYPES.TRANSITION' },
      { value: 'ending', viewValue: 'EDITOR.NODE_EDITOR.TYPES.ENDING' },
      { value: 'challenge', viewValue: 'EDITOR.NODE_EDITOR.TYPES.CHALLENGE' },
    ];
    this.initialType = [
      { value: 'initial', viewValue: 'EDITOR.NODE_EDITOR.TYPES.INITIAL' },
    ];
    this.mediaTypes = [
      { value: 'none', viewValue: 'EDITOR.NODE_EDITOR.MEDIA_TYPES.NONE' },
      { value: 'image', viewValue: 'EDITOR.NODE_EDITOR.MEDIA_TYPES.IMAGE' },
      { value: 'video', viewValue: 'EDITOR.NODE_EDITOR.MEDIA_TYPES.VIDEO' },
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
    if (this.currentNode.data.image_id) {
      const imageId = this.currentNode.data.image_id;
      this.nodeForm.get('data.image_id').setValue(imageId)
      this.currentMediaType = 'image';
      this.currentImg = imageId;
    } else if (this.currentNode.data.video) this.currentMediaType == 'video';
    else this.currentMediaType = 'none';
    this.nodeEditor.open();
  }

  updateNode() {
    try {
      let newNode = this.nodeForm.value;
      if (this.nodeForm.valid) {
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
    } catch (error) {
      console.log('error updating node: ', error);
    }
  }

  deleteNode() {
    try {
      if (this.currentNode && this.currentNode.type != 'initial') {
        this.nodes = this.nodes.filter((node) => {
          return node.id != this.currentNode.id;
        });
        this.links = this.links.filter((link) => {
          return (
            link.source != this.currentNode.id &&
            link.target != this.currentNode.id
          );
        });
        console.log(this.adventure);
        this.editorService.setAdventure(this.adventure);
        this.closeEditor();
        this.refreshGraph();
      }
    } catch (error) {
      console.log('error deleting node: ', error);
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
      width: '40rem',
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

    linksDialogRef.afterClosed().subscribe(
      (result) => {
        if (result.links) {
          this.adventure.links = result.links;
          this.refreshGraph();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  showChallengeDialog() {
    const challengeDialogRef = this.challengeDialog.open(
      ChallengeDialogComponent,
      {
        width: '40rem',
        data: {
          node: this.currentNode,
          adventure: this.adventure._id,
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

  showWebDialog() {
    const webDialogRef = this.webDialog.open(WebResourcesTableDialogComponent, {
      width: '70rem',
      data: {
        adventure: this.adventure,
      },
    });

    webDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
      }
    });
  }

  updateNodeType(type) {
    this.currentNode.type = type;
    console.log(this.currentNode);
  }

  handleFileInput(files: FileList) {
    let image = files.item(0);
    this.imageService.upload(image).subscribe(
      (res) => {
        let imageData: any = res;
        this.nodeForm.get('data.image_id').setValue(imageData.id);
        this.currentImg = imageData.id;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  get nodes() {
    return this.adventure.nodes;
  }

  set nodes(nodes) {
    this.adventure.nodes = nodes;
  }

  get links() {
    return this.adventure.links;
  }

  set links(links) {
    this.adventure.links = links;
  }

  get targetNodes() {
    return this.adventure.nodes.filter((node) => this.currentNode != node);
  }
}
