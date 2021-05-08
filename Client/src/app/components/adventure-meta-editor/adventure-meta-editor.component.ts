import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
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
  imagePreview: string;
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
    private adventureService: AdventureService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this.adventureSubscription = this.editorService.adventureEmitter.subscribe(
      (adventure) => {
        this.adventure = adventure;
      }
    );
    this.mediaTypes = [
      { value: 'image', viewValue: 'COMMON.YES' },
      { value: 'none', viewValue: 'COMMON.NO' },
    ];
    this.adventureService.getAdventures().subscribe(
      (res) => {
        this.adventures = res;
        this.adventures = this.adventures.filter((adv) => {
          return adv._id != this.adventure._id;
        });
        this.loading = false;
      },
      (err) => {
        console.log('error fetching adventures: ', err);
      }
    );
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
      this.metaForm.controls.image_id.setValue(this.adventure.image_id);
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

  imageSelectorChange(evt) {
    if (evt.value != 'image') {
      this.currentImg = undefined;
      this.imagePreview = undefined;
      this.metaForm.controls.image_id.setValue(undefined);
    } else {
      if (this.adventure.image_id) {
        this.image = undefined;
        this.currentImg = this.adventure.image_id;
        this.metaForm.controls.image_id.setValue(this.adventure.image_id);
        console.log(this.metaForm.value);
      }
    }
  }

  saveAllChanges() {
    if (this.metaForm.valid) {
      if (this.currentMediaType == 'image') {
        if (this.image) {
          console.log('habia imagen subida por archivo!');
          this.imageService.upload(this.image).subscribe(
            (res) => {
              this.editorService.setUpdating(true);
              let imageData: any = res;
              this.metaForm.controls.image_id.setValue(imageData.id);
              this.currentImg = imageData.id;
              this.editorService.updateMeta(this.metaForm.value);
              this.imagePreview = undefined;
              this.image = undefined;
              this.editorService.updateAdventure();
            },
            (err) => {
              this.editorService.setUpdating(true);
              this.editorService.updateMeta(this.metaForm.value);
              this.editorService.updateAdventure();
            }
          );
        } else if (this.currentImg && this.metaForm.value.image_id) {
          console.log('habia imagen anterior!!');
          this.editorService.setUpdating(true);
          this.editorService.updateMeta(this.metaForm.value);
          this.editorService.updateAdventure();
        } else {
          console.log(this.metaForm.value);
          this.translate.get('COMMON.TOASTR').subscribe((res) => {
            this.toastr.warning(res.IMG_NOT_SELECTED);
          });
        }
      } else {
        console.log('no había ninguna imagen!');
        this.editorService.setUpdating(true);
        this.editorService.updateMeta(this.metaForm.value);
        this.editorService.updateAdventure();
      }
    } else {
      this.translate.get('META_EDITOR.TOASTR').subscribe((res) => {
        this.toastr.warning(res.INVALID_FORM);
      });
    }
  }
}
