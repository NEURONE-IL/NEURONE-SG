import { Component, EventEmitter, Inject, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { EditorService } from 'src/app/services/game/editor.service';
import { ImageService } from 'src/app/services/game/image.service';
import { environment } from 'src/environments/environment';
import Utils from '../../../utils/utils';

@Component({
  selector: 'app-new-node-dialog',
  templateUrl: 'new-node-dialog.html',
  styleUrls: ['new-node-dialog.scss'],
})
export class NewNodeDialogComponent {
  newNodeForm: FormGroup;
  image: File;
  loading = false;
  apiUrl = environment.apiUrl;
  imagePreview: string;
  currentMediaType = 'image';
  mediaTypes: any;

  nodeTypes = [
    { value: 'transition', viewValue: 'EDITOR.NODE_EDITOR.TYPES.TRANSITION' },
    { value: 'ending', viewValue: 'EDITOR.NODE_EDITOR.TYPES.ENDING' },
    { value: 'challenge', viewValue: 'EDITOR.NODE_EDITOR.TYPES.CHALLENGE' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    public editorService: EditorService,
    public dialogRef: MatDialogRef<NewNodeDialogComponent>,
    private imageService: ImageService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.mediaTypes = [
      { value: 'none', viewValue: 'EDITOR.NODE_EDITOR.MEDIA_TYPES.NONE' },
      { value: 'image', viewValue: 'EDITOR.NODE_EDITOR.MEDIA_TYPES.IMAGE' },
      { value: 'video', viewValue: 'EDITOR.NODE_EDITOR.MEDIA_TYPES.VIDEO' },
    ];
    this.newNodeForm = this.formBuilder.group({
      label: ['', Validators.required],
      type: ['', Validators.required],
      data: this.formBuilder.group({
        image_id: [''],
        video: [''],
        text: ['', Validators.required],
      }),
    });
  }

  handleFileInput(files: FileList) {
    this.image = files.item(0);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imagePreview = event.target.result;
    };
    reader.readAsDataURL(this.image);
  }

  nodeMediaChange(evt) {
    if (evt.value == 'none') {
      this.imagePreview = undefined;
      this.image = undefined;
      this.newNodeForm.get('data.image_id').setValue(undefined);
      this.newNodeForm.get('data.video').setValue(undefined);
      this.newNodeForm.get('data.video').setErrors(null);
      this.newNodeForm.get('data.video').clearValidators();
    }
    if (evt.value == 'video') {
      this.imagePreview = undefined;
      this.image = undefined;
      this.newNodeForm.get('data.image_id').setValue(undefined);
      this.newNodeForm.get('data.video').setErrors(null);
      this.newNodeForm.get('data.video').setValidators(Validators.required);
    }
    if (evt.value == 'image') {
      this.newNodeForm.get('data.video').setValue(undefined);
      this.newNodeForm.get('data.video').setErrors(null);
      this.newNodeForm.get('data.video').clearValidators();
    }
  }

  async addNewNode() {
    Utils.markFormGroupTouched(this.newNodeForm);
    console.log(this.newNodeForm);
    if (this.newNodeForm.valid) {
      // Upload image if necessary
      if (this.currentMediaType == 'image') {
        if (this.image) {
          await this.uploadImage();
          // Set default challenge if necessary
          this.setDefaultChallenge(this.newNodeForm.value);
          this.dialogRef.close({ newNode: this.newNodeForm.value });
        } else {
          this.translate.get('COMMON.TOASTR').subscribe((res) => {
            this.toastr.warning(res.IMG_NOT_SELECTED);
          });
        }
      } else {
        // Set default challenge if necessary
        this.setDefaultChallenge(this.newNodeForm.value);
        this.dialogRef.close({ newNode: this.newNodeForm.value });
      }
    } else {
      this.translate.get('COMMON.TOASTR').subscribe((res) => {
        this.toastr.warning(res.INVALID_FORM);
      });
    }
  }

  private async uploadImage() {
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
    console.log('uploadedImage: ', uploadedImage);
    if (uploadedImage) {
      this.newNodeForm.get('data.image_id').setValue(uploadedImage.id);
    }
  }

  private setDefaultChallenge(newNode: any) {
    if (newNode.type == 'challenge') {
      let defaultChallenge = {
        type: 'question',
        question: "What's 10 + 15",
        answer: '25',
      };

      this.translate.get('DEFAULT_CHALLENGE').subscribe(
        (res) => {
          if (res.QUESTION && res.ANSWER) {
            defaultChallenge.question = res.QUESTION;
            defaultChallenge.answer = res.ANSWER;
          }
        },
        (err) => {
          console.log('error fetching default challenge translations');
          console.log(err);
        }
      );

      newNode.challenge = defaultChallenge;
    }
  }
}
