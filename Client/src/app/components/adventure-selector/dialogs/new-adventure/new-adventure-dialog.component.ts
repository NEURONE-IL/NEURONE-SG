import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { AdventureService } from 'src/app/services/game/adventure.service';
import { ImageService } from 'src/app/services/game/image.service';
import { environment } from 'src/environments/environment';
import Utils from 'src/app/utils/utils';

const URL = environment.apiUrl + '/files/upload';

@Component({
  selector: 'app-new-adventure-dialog',
  templateUrl: './new-adventure-dialog.component.html',
  styleUrls: ['./new-adventure-dialog.component.scss'],
})
export class NewAdventureDialogComponent implements OnInit {
  newAdventureForm: FormGroup;
  image: File;
  imagePreview: string;
  loading = true;
  apiUrl = environment.apiUrl;
  adventures: any;
  currentMediaType: string = 'none';
  mediaTypes: any;

  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'image',
  });

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewAdventureDialogComponent>,
    private imageService: ImageService,
    private adventureService: AdventureService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this.newAdventureForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image_id: [],
      preconditions: [[]],
    });
    this.mediaTypes = [
      { value: 'none', viewValue: 'COMMON.NO' },
      { value: 'image', viewValue: 'COMMON.YES' },
    ];
    this.adventureService.getAdventures().subscribe(
      (res) => {
        this.adventures = res;
        this.loading = false;
      },
      (err) => {
        console.log('error fetching adventures: ', err);
      }
    );
  }

  ngOnInit(): void {
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, status: any) => {
      console.log('Uploaded Image Details:', item);
    };
  }

  addNewAdventure() {
    Utils.markFormGroupTouched(this.newAdventureForm);
    if (this.newAdventureForm.valid && !this.loading) {
      if (this.image) {
        this.imageService.upload(this.image).subscribe(
          (res) => {
            let imageData: any = res;
            this.newAdventureForm.controls.image_id.setValue(imageData.id);
            const newAdventure = this.newAdventureForm.value;
            this.dialogRef.close({ newAdventure: newAdventure });
          },
          (err) => {
            console.log(err);
            const newAdventure = this.newAdventureForm.value;
            this.dialogRef.close({ newAdventure: newAdventure });
          }
        );
      } else {
        if (this.currentMediaType != 'none') {
          this.translate.get('NEW_ADVENTURE.TOASTR').subscribe((res) => {
            this.toastr.warning(res.IMG_NOT_SELECTED);
          });
        } else {
          const newAdventure = this.newAdventureForm.value;
          this.dialogRef.close({ newAdventure: newAdventure });
        }
      }
    } else {
      this.translate.get('NEW_ADVENTURE.TOASTR').subscribe((res) => {
        this.toastr.warning(res.INVALID_FORM);
      });
    }
  }

  handleFileInput(files: FileList) {
    this.image = files.item(0);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imagePreview = event.target.result;
    };
    reader.readAsDataURL(this.image);
  }
}
