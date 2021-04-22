import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdventureService } from 'src/app/services/game/adventure.service';
import { EditorService } from 'src/app/services/game/editor.service';
import { ImageService } from 'src/app/services/game/image.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-adventure-meta-editor',
  templateUrl: './adventure-meta-editor.component.html',
  styleUrls: ['./adventure-meta-editor.component.scss'],
})
export class AdventureMetaEditorComponent implements OnInit {
  adventure: any;
  adventureSubscription: Subscription;
  adventures: any;
  image: File;
  currentImg: string;
  loading = true;
  currentMediaType: string = 'none';
  mediaTypes: any;
  apiUrl = environment.apiUrl;

  metaForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public editorService: EditorService,
    private imageService: ImageService,
    private adventureService: AdventureService
  ) {
    this.adventureSubscription = this.editorService.adventureEmitter.subscribe(
      (adventure) => {
        this.adventure = adventure;
      }
    );
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
    this.metaForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image_id: [],
      preconditions: [[]],
    });
    if (this.adventure.image_id) {
      this.currentMediaType = 'image';
      this.currentImg = this.adventure.image_id;
    }
  }

  handleFileInput(files: FileList) {
    let image = files.item(0);
    this.imageService.upload(image).subscribe(
      (res) => {
        let imageData: any = res;
        this.metaForm.controls.image_id.setValue(imageData.id);
        this.currentImg = imageData.id;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  imageSelectorChange(evt) {
    if (evt.value != 'image') {
      console.log('delete image now');
      this.currentImg = undefined;
      this.metaForm.controls.image_id.setValue(undefined);
    }
  }

  saveAllChanges() {
    this.editorService.setUpdating(true);
    this.editorService.updateMeta(this.metaForm.value);
    this.editorService.updateAdventure();
  }
}
