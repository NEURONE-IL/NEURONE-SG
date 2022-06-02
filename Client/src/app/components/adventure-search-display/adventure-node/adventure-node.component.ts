import { Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { EditorService } from 'src/app/services/game/editor.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ChallengeViewComponent } from './challenge-view/ChallengeViewComponent';
import { WebResourcesSearchDialogComponent } from './web-resources-search-dialog/web-resources-search-dialog.component';
import { ImageService } from 'src/app/services/game/image.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { AdventureService } from 'src/app/services/game/adventure.service';


@Component({
  selector: 'app-adventure-node',
  templateUrl: './adventure-node.component.html',
  styleUrls: ['./adventure-node.component.scss']
})
export class AdventureNodeComponent implements OnInit {

  @ViewChild('sidenav') nodeEditor: MatSidenav;

  // Forms
  nodeForm: FormGroup;

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
  currentMediaTypeView: string;
  currentNodeTypeView: string;

  canOpen: boolean;

  // Image handling variables
  image: File; // Image file selected
  imagePreview: string; // Selected image file preview
  currentImg: string; // Existing image from db

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
    public challengeView: MatDialog,
    public linksDialog: MatDialog,
    public webDialog: MatDialog,
    private translate: TranslateService,
    private adventureService: AdventureService,
    private route: ActivatedRoute
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
      this.adventureService.getAdventure(this.route.snapshot.paramMap.get('adventure_id')).subscribe(
        (res) => {
          this.adventure = res;
        },
        (err) => {
          console.log('error fetching adventure: ', err);
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
    this.closeDialogs();
  }

  // Closes all possible dialogs
  closeDialogs() {
    if (this.newNodeDialog) this.newNodeDialog.closeAll();
    if (this.challengeView) this.challengeView.closeAll();
    if (this.linksDialog) this.linksDialog.closeAll();
  }

  // Shows the node editor
  openEditor(node: any) {
    if (this.canOpen) {
      this.editorService.setCurrentNode(node);
      this.setNodeForm(node);
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
    this.currentMediaTypeView = this.mediaTypes.find(type => type.value === this.currentMediaType).viewValue
  }

  // Sets current node data on edit form
  private setNodeForm(node: any) {
    this.resetImg();
    this.currentNodeType = node.type;
    if(this.currentNodeType === 'initial'){
      this.currentNodeTypeView = this.initialType[0].viewValue;
    }
    else{
      this.currentNodeTypeView = this.nodeTypes.find(type => type.value === this.currentNodeType).viewValue
    }
    //this.currentNodeTypeView =
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
  }

  // Refreshes the graphical editor
  refreshGraph() {
    this.closeDialogs();
    this.closeEditor();
    this.updateGraph.next(true);
  }

  // Displays link creation dialog

  // Displays challenge dialog
  showChallengeDialog() {
    const challengeDialogRef = this.challengeView.open(
      ChallengeViewComponent,
      {
        width: '40rem',
        data: {
          node: this.nodeForm.value,
          adventure: this.adventure._id,
        },
      }
    );

    challengeDialogRef.afterClosed().subscribe((result) => {
      if (result && result.challenge) {
        console.log('result challenge: ', result.challenge);
        this.nodeForm.get('challenge').setValue(result.challenge);
      }
    });
  }

  // Displays web resources dialog
  showWebDialog() {
    const webDialogRef = this.webDialog.open(WebResourcesSearchDialogComponent, {
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
