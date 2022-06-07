import { Component, EventEmitter, OnInit, Output, ViewChild,HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AdventureService } from 'src/app/services/game/adventure.service';
import { HistoryService } from 'src/app/services/admin/history.service'
import { EditorService } from 'src/app/services/game/editor.service';
import { ImageService } from 'src/app/services/game/image.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatTable } from '@angular/material/table';

export interface Collaborators {
  user: any,
  invitation: string,
}

export function tagExist(tags): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(tags != null){
      control.markAsTouched();
      const isValid = tags.some(tag => control.value.toLowerCase() === tag.toLowerCase());
      return isValid ? { 'tagExist': true }: null;
    }
    
  };
}
export function notExistingColl(collaborators): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(collaborators != null){
      let notExist: boolean = true;

      collaborators.filter( coll => {
        if(coll.user.email === control.value){
          notExist = false
        }
      })
      return notExist ? null : { 'notExistingColl': true };
    }
    
  };
}

export function notThisUser(user): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(user != null){
      control.markAsTouched();
      const isValid = user.email !== control.value;
      return isValid ? null : { 'notThisUser': true };
    }
    
  };
}
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
  user: any;
  collaborators: Collaborators;
  metaForm: FormGroup;

  //Valentina
  tags: String[] = [];
  privacies = [
    {privacy:"Público", value: false}, 
    {privacy:"Privado", value: true}
  ];
  emailFormControl: FormControl;
  collaboratorsExist: boolean = false;
  userOwner: boolean = true;
  cloneHistory: any[];
  wasClone: boolean = false;
  loadingColl: boolean = false;
  
  columnsToDisplayCollaborators = ['icon','fullname', 'email', 'invitation','actions'];
  columnsToDisplayCollaboratorsNotOwner = ['icon','fullname', 'email','invitation'];
  columnsToDisplayCloneHistory = ['fullname', 'email', 'date','hour'];


  constructor(
    private formBuilder: FormBuilder,
    public editorService: EditorService,
    private imageService: ImageService,
    private adventureService: AdventureService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private auth: AuthService,
    private historyService: HistoryService
  ) {
    this.user = this.auth.getUser();
    this.adventureSubscription = this.editorService.adventureEmitter.subscribe(
      (adventure) => {
        this.adventure = adventure;
      }
    );
    this.mediaTypes = [
      { value: 'image', viewValue: 'COMMON.YES' },
      { value: 'none', viewValue: 'COMMON.NO' },
    ];
    this.adventureService.getAdventuresByUser(this.user._id).subscribe(
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
  ngOnDestroy(): void {
    this.editorService.reset();
  }
  ngOnInit(): void {
    this.tags = this.adventure.tags.slice();
    if (this.adventure.collaborators.length>0)
          this.collaboratorsExist = true;

    if(!(this.user._id == this.adventure.user._id)){
      this.userOwner = false;

    }
    
    this.collaborators = this.adventure.collaborators;
    this.emailFormControl = new FormControl('', [Validators.email,notThisUser(this.user),notExistingColl(this.adventure.collaborators)]);
    
        this.historyService.getHistoryByAdventureByType(this.adventure._id,'clone').subscribe(
      response => {
        this.cloneHistory = response['histories'];

        if (this.cloneHistory.length>0){
          this.cloneHistory.forEach( history => {

            let d = new Date(history.createdAt);
            let date = (d.getDate() < 10? '0':'') + d.getDate() + (d.getMonth() < 10 ? '/0' : '/') + (d.getMonth() + 1) + '/' + d.getFullYear();          
            let hour = (d.getHours() < 10 ? '0' : '') +d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '')+ d.getMinutes();
            history.createdAt = date + ' ' + hour;
          })
          this.wasClone = true;

        }
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.NOT_LOADED_ERROR"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
    this.metaForm = this.formBuilder.group({
      name: [this.adventure.name, Validators.required],
      description: [this.adventure.description, Validators.required],
      image_id: [],
      preconditions: this.adventure.preconditions,
      privacy: this.adventure.privacy,
      collaborators: this.adventure.collaborators,
      tags:['',[Validators.minLength(3), Validators.maxLength(15), tagExist(this.tags)]],
    });
    if(!this.userOwner){
      this.metaForm.controls.privacy.disable();
      this.metaForm.controls.preconditions.disable();
    }
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
      if(!this.userOwner){
        this.metaForm.controls.privacy.enable();
        this.metaForm.controls.preconditions.enable();
      }
      if(this.adventure.preconditions.length === 0)
        this.metaForm.controls.preconditions.setValue([]);

      if (this.currentMediaType == 'image') {
        if (this.image) {
          console.log('habia imagen subida por archivo!');
          this.imageService.upload(this.image).subscribe(
            (res) => {
              this.editorService.setUpdating(true);
              let imageData: any = res;
              this.metaForm.controls.image_id.setValue(imageData.id);
              //vale
              this.currentImg = imageData.id;
              let body = this.metaForm.value;
              body.tags = this.tags
              this.editorService.updateMeta(body);
              this.imagePreview = undefined;
              this.image = undefined;
              this.editorService.updateAdventure();
            },
            (err) => {
              this.editorService.setUpdating(true);
              let body = this.metaForm.value;
              body.tags = this.tags
              this.editorService.updateMeta(body);
              this.editorService.updateAdventure();
            }
          );
        } else if (this.currentImg && this.metaForm.value.image_id) {
          console.log('habia imagen anterior!!');
          this.editorService.setUpdating(true);
          let body = this.metaForm.value;
          body.tags = this.tags
          this.editorService.updateMeta(body);
          this.editorService.updateAdventure();
        } else {
          let body = this.metaForm.value;
          body.tags = this.tags
          this.translate.get('COMMON.TOASTR').subscribe((res) => {
            this.toastr.warning(res.IMG_NOT_SELECTED);
          });
        }
      } else {
        console.log('no había ninguna imagen!');
        this.editorService.setUpdating(true);
        let body = this.metaForm.value;
        body.tags = this.tags
        this.editorService.updateMeta(body);
        this.editorService.updateAdventure();
      }
    } else {
      this.translate.get('META_EDITOR.TOASTR').subscribe((res) => {
        this.toastr.warning(res.INVALID_FORM);
      });
    }
    if(!this.userOwner){
      this.metaForm.controls.privacy.disable();
      this.metaForm.controls.preconditions.disable();
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
  addTag(){
    let tag = this.metaForm.value.tags;
    const value = (tag || '').trim();

    if (value && !(this.metaForm.controls.tags.status === 'INVALID')) {
      this.tags.push(value.toLowerCase());
      this.metaForm.controls.tags.setValue('');
    }
  }
  onTabClick(event) {
    let index = event.index
    switch(index) { 
      case 0: { 
        //this.getAllStudiesByUser(); 
        break; 
      } 
      case 1: { //Privados
        var privacy = true;
        //this.getStudiesByPrivacy(privacy); 
        break; 
      } 
      case 2: { //Publicos
        var privacy = false;
        //this.getStudiesByPrivacy(privacy); 
        break; 
      } 
      case 3: { 
        var type = 'clone'
        //this.getStudiesByType(type)
        console.log('1');
        break; 
      }
      case 4: { 
        //this.getStudiesByCollaboration();
        break; 
      }
      default: { 
         //statements; 
         break; 
      } 
   }
  }
  confirmAddCollaborator(){
    confirm('¿Seguro que desea agregar al colaborador?') && this.verifyCollaborator();
  }
  verifyCollaborator(){
    if(this.emailFormControl.value === '' || this.emailFormControl.status === 'INVALID'){
      return
    }
    let collaborator: any;
    this.auth.getUserbyEmail(this.emailFormControl.value).subscribe(
      response => {
        collaborator = response['user']
        this.addCollaborator(collaborator);

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
  addCollaborator(user: any){
    let newCollaboratorList = this.adventure.collaborators.slice();
    newCollaboratorList.push({user: user, invitation: 'Pendiente'});
    console.log(newCollaboratorList)
    this.editCollaborator(newCollaboratorList,"Se ha añadido correctamente el colaborador al estudio","El colaborador no ha podido ser añadido");
    this.emailFormControl.setValue('');
  }
  @ViewChild(MatTable) table: MatTable<Collaborators>;
  editCollaborator(collaboratorList, msg1, msg2){
    this.loadingColl = true;
    this.adventureService.editCollaboratorAdventure(this.adventure._id, collaboratorList).subscribe(
      response => {
        this.toastr.success(msg1, "Éxito",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.loadingColl = false;
        this.adventure.collaborators = response.adventure.collaborators;
        this.collaborators = response.adventure.collaborators

        this.emailFormControl.setValidators([Validators.email,notThisUser(this.user),notExistingColl(this.adventure.collaborators)]);
        this.emailFormControl.updateValueAndValidity();
        
        if(this.adventure.collaborators.length > 0){
          this.collaboratorsExist = true;
          this.table.renderRows();
        }
        else
          this.collaboratorsExist = false;
        
      },
      err => {
        console.log(err)
        this.toastr.error(msg2, "Error",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.loadingColl = false;
      }
    );
  }
  confirmRemoveCollaborator(collaborator){
    confirm('¿Seguro que desea eliminar al colaborador?') && this.deleteCollaborator(collaborator);
  }
  deleteCollaborator(collaborator){
    var newCollaboratorList = this.adventure.collaborators.filter(
                              coll => coll.user.email !== collaborator.user.email);
    this.editCollaborator(newCollaboratorList,"Se ha eliminado correctamente el colaborador al estudio","El colaborador no ha podido ser eliminado");
  }
}
