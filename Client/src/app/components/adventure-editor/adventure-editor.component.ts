import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-adventure-editor',
  templateUrl: './adventure-editor.component.html',
  styleUrls: ['./adventure-editor.component.scss'],
})
export class AdventureEditorComponent implements OnInit, OnDestroy {
  // Sidenav reference
  @ViewChild('sidenav') nodeEditor: MatSidenav;

  // Forms
  nodeForm: FormGroup;
  challengeForm: FormGroup;
  nodeLinkForm: FormGroup;

  // Adventure and sub components variables
  adventure: any;
  currentNode: any;
  updating: boolean;
  currentNodeType: string;

  // Subject to notify when the graph refreshes
  updateGraph: Subject<boolean> = new Subject();

  // Auxiliary variables
  nodeTypes: any;
  initialType: any;
  mediaTypes: any;
  currentMediaType: string;
  canOpen: boolean;

  // Image handling variables
  image: File; // Image file selected
  imagePreview: string; // Selected image file preview
  currentImg: string; // Existing image from db
  @ViewChild('fileInput')
  fileInputElement: ElementRef; // File input element reference

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
    private imageService: ImageService,
    private translate: TranslateService,
    private toastr: ToastrService
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
      id: ['', Validators.required],
      label: ['', Validators.required],
      type: ['', Validators.required],
      challenge: [],
      data: this.formBuilder.group({
        image_id: [],
        video: [],
        text: ['', Validators.required],
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
    this.canOpen = true;
  }

  ngOnDestroy(): void {
    this.adventureSubscription.unsubscribe();
    this.currentNodeSubscription.unsubscribe();
    this.updatingSubscription.unsubscribe();
    this.updateSubscription.unsubscribe();
    this.closeDialogs();
  }

  // Closes all possible dialogs
  closeDialogs() {
    if (this.newNodeDialog) this.newNodeDialog.closeAll();
    if (this.challengeDialog) this.challengeDialog.closeAll();
    if (this.linksDialog) this.linksDialog.closeAll();
  }

  // Shows the node editor
  openEditor(node: any) {
    console.log(this.canOpen);
    if (this.canOpen) {
      this.editorService.setCurrentNode(node);
      this.setNodeForm();
      this.setCurrentMediaType();
      this.nodeEditor.open();
    }
  }

  // Closes the node editor
  closeEditor() {
    this.editorService.currentNode = null;
    if (this.nodeEditor && this.nodeEditor.opened) {
      this.canOpen = false;
      this.nodeEditor.close().then(() => {
        this.clearNodeForm();
        this.canOpen = true;
      });
    }
  }

  // Sets the current media type to dynamically update the node edit form
  private setCurrentMediaType() {
    if (this.currentNode.data.image_id) {
      const imageId = this.currentNode.data.image_id;
      this.currentMediaType = 'image';
      this.currentImg = imageId;
    } else if (this.currentNode.data.video) {
      this.currentMediaType = 'video';
    } else {
      this.currentMediaType = 'none';
    }
  }

  // Sets current node data on edit form
  private setNodeForm() {
    this.resetImg();
    this.currentNodeType = this.currentNode.type;
    this.nodeForm.get('id').setValue(this.currentNode.id);
    this.nodeForm.get('label').setValue(this.currentNode.label);
    this.nodeForm.get('type').setValue(this.currentNode.type);
    this.nodeForm.get('challenge').setValue(this.currentNode.challenge);
    this.nodeForm.get('data.image_id').setValue(this.currentNode.data.image_id);
    this.nodeForm.get('data.video').setValue(this.currentNode.data.video);
    this.nodeForm.get('data.text').setValue(this.currentNode.data.text);
  }

  // Reset node edit form
  private clearNodeForm() {
    this.nodeForm.get('id').setValue(undefined);
    this.nodeForm.get('label').setValue(undefined);
    this.nodeForm.get('type').setValue(undefined);
    this.nodeForm.get('challenge').setValue(undefined);
    this.nodeForm.get('data.image_id').setValue(undefined);
    this.nodeForm.get('data.video').setValue(undefined);
    this.nodeForm.get('data.text').setValue(undefined);
    this.resetImg();
  }

  // Resets image previews and selector
  private resetImg() {
    this.imagePreview = undefined;
    this.image = undefined;
    this.currentImg = undefined;
    this.nodeForm.get('data.image_id').setValue(undefined);
    this.resetImgInput();
  }

  private resetImgInput() {
    if (this.fileInputElement && this.fileInputElement.nativeElement) {
      // console.log('reset file input');
      this.fileInputElement.nativeElement.value = '';
    }
  }

  // Updates node changes directly into the adventure
  async updateNode() {
    try {
      let newNode = this.nodeForm.value;
      if (this.nodeForm.valid) {
        if (this.currentNode.type == 'initial' && newNode.type != 'initial') {
          console.log('Initial node type cannot be changed');
        } else {
          if (
            this.currentMediaType == 'image' &&
            !this.image &&
            !newNode.data.image_id
          ) {
            this.translate.get('COMMON.TOASTR').subscribe((res) => {
              this.toastr.warning(res.IMG_NOT_SELECTED);
            });
          } else {
            // Upload image if necessary
            if (this.image) {
              await this.uploadImage(newNode);
            }
            // Validate selected media
            this.validateMedia(newNode);
            // Delete orphaned challenge if not a challenge node
            if (newNode.challenge && newNode.type != 'challenge')
              delete newNode.challenge;
            // Attach updated node to adventure
            this.nodes.forEach((node, index) => {
              if (node.id == this.currentNode.id) {
                this.nodes[index] = newNode;
              }
            });
            // Update referenced links
            this.updateLinks(newNode);

            this.editorService.setAdventure(this.adventure);
            this.closeEditor();
            this.refreshGraph();
          }
        }
      } else {
        this.translate.get('COMMON.TOASTR').subscribe((res) => {
          this.toastr.warning(res.INVALID_FORM);
        });
      }
    } catch (error) {
      this.translate.get('COMMON.TOASTR').subscribe((res) => {
        this.toastr.error(res.UPDATE_FAILURE);
      });
      console.log('error updating node: ', error);
    }
  }

  // Update links in case the referenced source or target changes ID
  private updateLinks(newNode: any) {
    this.links.forEach((link) => {
      if (link.source == this.currentNode.id) {
        link.source = newNode.id;
      }
      if (link.target == this.currentNode.id) {
        link.target = newNode.id;
      }
    });
  }

  // Validates that media data is OK for every case
  private validateMedia(newNode: any) {
    if (this.currentMediaType == 'video') {
      delete newNode.data.image_id;
    }
    if (this.currentMediaType == 'image') {
      delete newNode.data.video;
    }
    if (this.currentMediaType == 'none') {
      delete newNode.data.video;
      delete newNode.data.image_id;
    }
  }

  // Removes a node from current adventure
  // and cleans referenced links
  deleteNode() {
    this.translate.get('WARNINGS').subscribe((res) => {
      if (confirm(res.DELETE_NODE)) {
        try {
          if (this.currentNode && this.currentNode.type != 'initial') {
            this.nodes = this.nodes.filter((node) => {
              return node.id != this.currentNode.id;
            });
            // Clean orphaned links
            this.cleanOrphanedLinks();
            this.editorService.setAdventure(this.adventure);
            this.closeEditor();
            this.refreshGraph();
          }
        } catch (error) {
          this.translate.get('EDITOR.NODE_EDITOR.TOASTR').subscribe((res) => {
            this.toastr.error(res.DELETE_FAILURE);
          });
          console.log('error deleting node: ', error);
        }
      }
    });
  }

  // Deletes orphaned links
  // For example, when a node gets deleted, these links will no longer work,
  // so they must be deleted.
  private cleanOrphanedLinks() {
    this.links = this.links.filter((link) => {
      return (
        link.source != this.currentNode.id && link.target != this.currentNode.id
      );
    });
  }

  // Pushes a new node into the current adventure
  addNode(newNode) {
    newNode.id = nanoid(13);
    this.nodes.push(newNode);
    this.refreshGraph();
  }

  // Refreshes the graphical editor
  refreshGraph() {
    this.closeDialogs();
    this.closeEditor();
    this.updateGraph.next(true);
  }

  // Displays node creation dialog
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

  // Displays link creation dialog
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

  // Displays challenge dialog
  showChallengeDialog() {
    const challengeDialogRef = this.challengeDialog.open(
      ChallengeDialogComponent,
      {
        width: '40rem',
        data: {
          node: this.nodeForm.value,
          adventure: this.adventure._id,
        },
      }
    );

    challengeDialogRef.afterClosed().subscribe((result) => {
      if (result.challenge) {
        console.log('result challenge: ', result.challenge);
        this.nodeForm.get('challenge').setValue(result.challenge);
      }
    });
  }

  // Displays web resources dialog
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

  // Updates current node type
  // this is needed to refresh the editor form
  updateNodeType(type) {
    this.currentNodeType = type;
    this.setDefaultChallenge(type);
    console.log(this.currentNode);
  }

  // Sets default challenge for a node when it's type is set to challenge
  private setDefaultChallenge(type: any) {
    if (type == 'challenge') {
      let currentChallenge = this.nodeForm.get('challenge').value;
      if (!currentChallenge) {
        let localizedDefault = this.translate.instant('DEFAULT_CHALLENGE');
        let defaultChallenge = {
          type: 'question',
          question: localizedDefault.QUESTION || "What's 10 + 15",
          answer: localizedDefault.ANSWER || '25',
        };
        this.nodeForm.get('challenge').setValue(defaultChallenge);
      }
    }
  }

  // Handles the event when the user
  // selects a new file on the image file selector
  handleFileInput(files: FileList) {
    this.image = files.item(0);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imagePreview = event.target.result;
    };
    reader.readAsDataURL(this.image);
  }

  // Sets validators for different node types on the editor form
  nodeMediaChange(evt) {
    if (evt.value == 'none') {
      this.nodeForm.get('data.video').setErrors(null);
      this.nodeForm.get('data.video').clearValidators();
    }
    if (evt.value == 'video') {
      this.nodeForm.get('data.video').setErrors(null);
      this.nodeForm.get('data.video').setValidators(Validators.required);
    }
    if (evt.value == 'image') {
      this.nodeForm.get('data.video').setErrors(null);
      this.nodeForm.get('data.video').clearValidators();
    }
  }

  // Uploads an image
  private async uploadImage(newNode) {
    let uploadedImage;
    await this.imageService
      .upload(this.image)
      .toPromise()
      .then((res) => {
        uploadedImage = res;
      })
      .catch((err) => {
        console.log(err);
      });
    if (uploadedImage) {
      newNode.data.image_id = uploadedImage.id;
    }
  }

  // Gets the current adventure nodes
  get nodes() {
    return this.adventure.nodes;
  }

  // Sets the current adventure nodes
  set nodes(nodes) {
    this.adventure.nodes = nodes;
  }

  // Gets the current adventure links
  get links() {
    return this.adventure.links;
  }

  // Sets the current adventure links
  set links(links) {
    this.adventure.links = links;
  }

  // Gets the all nodes that are different from the current node
  // this represents every possible target on link creation
  get targetNodes() {
    return this.adventure.nodes.filter((node) => this.currentNode != node);
  }
}
