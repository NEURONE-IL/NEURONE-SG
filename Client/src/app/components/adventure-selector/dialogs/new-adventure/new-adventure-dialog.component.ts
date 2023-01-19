import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { AdventureService } from 'src/app/services/game/adventure.service';
import { ImageService } from 'src/app/services/game/image.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';

import Utils from 'src/app/utils/utils';

export function notThisUser(user): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(user != null){
      control.markAsTouched();
      const isValid = user.email !== control.value;
      return isValid ? null : { 'notThisUser': true };
    }
    
  };
}
export function tagExist(tags): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(tags != null && control.value != null){
      control.markAsTouched();
      const isValid = tags.some(tag => control.value.toLowerCase() === tag.toLowerCase());
      return isValid ? { 'tagExist': true }: null;
    }
    
  };
}

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
  //Valentina
  privacies = [
    {privacy:"Público", value: false}, 
    {privacy:"Privado", value: true}
  ];
  user: any;
  tags: String[] = ['ejemplo'];
  collaborators_selected: any[] = [];
  collaborator_status: boolean = false;


  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'image',
  });

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    public dialogRef: MatDialogRef<NewAdventureDialogComponent>,
    private imageService: ImageService,
    private adventureService: AdventureService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this.user = this.auth.getUser();
    this.newAdventureForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image_id: [],
      preconditions: [[]],
      privacy: ['', [Validators.required]],
      collaborators: ['', {validators: [Validators.email, notThisUser(this.user)], updateOn:'change'}],
      tags:['',[Validators.minLength(3), Validators.maxLength(15),tagExist(this.tags)]]
    });
    this.mediaTypes = [
      { value: 'none', viewValue: 'COMMON.NO' },
      { value: 'image', viewValue: 'COMMON.YES' },
    ];
    //Valentina
    let userId = this.auth.getUser()._id;
    this.adventureService.getAdventuresByUser(userId).subscribe(
      (res) => {
        this.adventures = res.adventures;
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
    
    let collaborators = [];
    if(this.collaborators_selected.length > 0)
      this.collaborators_selected.forEach(coll => collaborators.push({user:coll, invitation:'Pendiente'}))
    
    let colls = JSON.stringify(collaborators)
    let tags = JSON.stringify(this.tags);

    if (this.newAdventureForm.valid && !this.loading) {
      if (this.image) {
        this.imageService.upload(this.image).subscribe(
          (res) => {
            let imageData: any = res;
            this.newAdventureForm.controls.image_id.setValue(imageData.id);
            const newAdventure = this.newAdventureForm.value;
            newAdventure.collaborators = colls;
            newAdventure.tags = tags;
            this.dialogRef.close({ newAdventure: newAdventure });
          },
          (err) => {
            console.log(err);
            const newAdventure = this.newAdventureForm.value;
            newAdventure.collaborators = colls;
            newAdventure.tags = tags;
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
          newAdventure.collaborators = colls;
          newAdventure.tags = tags;
          console.log(newAdventure);
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

  //Valentina
  verifyCollaborator(){
    let email = this.newAdventureForm.value.collaborators;
    console.log(email)
    let emailExist: boolean;
    this.collaborators_selected.forEach(coll => {
      if(coll.email === email){
        emailExist = true;
        return
      }
        
    })
    if(emailExist || email === '' || this.newAdventureForm.controls.collaborators.status === 'INVALID'){
      return
    }
    let collaborator: any;
  
    this.auth.getUserbyEmail(email).subscribe(
      response => {
        console.log(response)
        collaborator = response['user']
        this.collaborators_selected.push(collaborator);
        this.newAdventureForm.controls.collaborators.setValue('');
        console.log(this.collaborators_selected);
        this.toastr.success(collaborator.email + " añadido exitosamente", "Éxito", {
          timeOut: 5000,
          positionClass: 'toast-top-center'});

      },
      (error) => {
        let err = error.error.message;
          if(err === 'EMAIL_NOT_FOUND'){
            this.toastr.error("No se encuentra el correo ingresado", "Usuario Inexistente", {
              timeOut: 5000,
              positionClass: 'toast-top-center'});
              return
            }

            if(err === 'ROLE_INCORRECT'){
            this.toastr.error("El usuario ingresado no cuenta con permisos de colaborador", "Usuario Incorrecto", {
              timeOut: 5000,
              positionClass: 'toast-top-center'});
              return
            }

            if(err === 'USER_NOT_CONFIRMED'){
            this.toastr.error("El usuario ingresado no ha terminado su proceso de registro", "Usuario no confirmado", {
              timeOut: 5000,
              positionClass: 'toast-top-center'});
              return
            }
      }
    );
  }
  removeCollaborator(user: any): void {
    console.log(this.collaborators_selected)
    const index = this.collaborators_selected.indexOf(user);

    if (index >= 0) {
      this.collaborators_selected.splice(index, 1);
    }
    console.log(this.collaborators_selected)

  }
  addTag(){
    let tag = this.newAdventureForm.value.tags;
    const value = (tag || '').trim();

    // Add our fruit
    if (value) {
      this.tags.push(value.toLowerCase());
      this.newAdventureForm.controls.tags.setValue('');
    }
  }
  removeTag(tag: String): void {
    console.log(tag)
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    console.log(this.tags)

  }
  changeStatus(event){
    this.collaborator_status = event.checked
  }
}
