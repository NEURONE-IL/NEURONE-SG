import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { AdventureService } from 'src/app/services/game/adventure.service';
import { ImageService } from 'src/app/services/game/image.service';
import { environment } from 'src/environments/environment';

const URL = environment.apiUrl + '/files/upload';

@Component({
  selector: 'app-new-adventure-dialog',
  templateUrl: './new-adventure-dialog.component.html',
  styleUrls: ['./new-adventure-dialog.component.scss'],
})
export class NewAdventureDialogComponent implements OnInit {
  newAdventureForm: FormGroup;
  image: File;
  currentImg: string;
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
    private adventureService: AdventureService
  ) {
    this.newAdventureForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image_id: [],
      preconditions: [[]],
    });
    this.mediaTypes = [
      { value: 'none', viewValue: 'COMMON.NO' },
      { value: 'image', viewValue: 'COMMON.YES' }
    ];
    this.adventureService.getAdventures().subscribe((res) => {
      this.adventures = res;
      this.loading = false;
    }, (err) => {
      console.log('error fetching adventures: ', err);
    });
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
    if (!this.loading) {
      const newAdventure = this.newAdventureForm.value;
      this.dialogRef.close({ newAdventure: newAdventure });
    }
  }

  handleFileInput(files: FileList) {
    let image = files.item(0);
    this.imageService.upload(image).subscribe(
      (res) => {
        let imageData: any = res;
        this.newAdventureForm.controls.image_id.setValue(imageData.id);
        this.currentImg = imageData.id;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
