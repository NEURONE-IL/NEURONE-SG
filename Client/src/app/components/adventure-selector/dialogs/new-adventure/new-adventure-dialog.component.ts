import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FileUploader } from 'ng2-file-upload';
import { environment } from './../../../../../environments/environment';

const URL = environment.apiUrl + '/files/upload';

@Component({
  selector: 'app-new-adventure-dialog',
  templateUrl: './new-adventure-dialog.component.html',
  styleUrls: ['./new-adventure-dialog.component.scss'],
})

export class NewAdventureDialogComponent implements OnInit {

  newAdventureForm: FormGroup;
  file: File;

  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'image'
  });

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewAdventureDialogComponent>
  ) {
    this.newAdventureForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
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
    const newAdventure = this.newAdventureForm.value;
    let adventureFormData = new FormData();
    adventureFormData.append('name', newAdventure.name);
    adventureFormData.append('description', newAdventure.description);
    if(this.file) {
      adventureFormData.append('file', this.file);
    }
    this.dialogRef.close({newAdventure: adventureFormData});
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }
}
