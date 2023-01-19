import { Component, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AdventureService } from 'src/app/services/game/adventure.service';
import { InvitationService } from 'src/app/services/admin/invitation.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-adventure-data',
  templateUrl: './adventure-data.component.html',
  styleUrls: ['./adventure-data.component.scss']
})
export class AdventureDataComponent implements OnInit {

  adventure: any;
  image: File;
  imagePreview: string;
  currentImg: string;
  loading = true;
  apiUrl = environment.apiUrl;
  user: any;


  //Valentina
  tags: String[] = [];
  privacies = [
    {privacy:"Público", value: false}, 
    {privacy:"Privado", value: true}
  ];
  collaboratorsExist: boolean = false;
  userOwner: boolean = true;
  notActualCollaborator: boolean = true;
  filterCollaborators: any[];
  loadingClone: boolean = false;
  existingInvitation: boolean = false;
  
  columnsToDisplay = ['icon','fullname', 'email'];

  constructor(
    private adventureService: AdventureService,
    private invitationService: InvitationService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.user = this.auth.getUser();

    this.adventureService.getAdventure(this.route.snapshot.paramMap.get('adventure_id')).subscribe(
      (res) => {
        this.adventure = res;
        this.tags = this.adventure.tags.slice();

        if (this.adventure.collaborators.length>0){
          this.collaboratorsExist = true;
          this.filterCollaborators = this.adventure.collaborators.filter(coll => coll.invitation === 'Aceptada')
          this.notActualCollaborator = !this.filterCollaborators.some(coll => coll.user._id === this.user._id)
        }
        if (this.adventure.image_id) {
          this.currentImg = this.adventure.image_id;
        }
        this.checkCollabInvitation();

      },
      (err) => {
        console.log('error fetching adventure: ', err);
      }
    );
  }

  ngOnInit(): void {
    
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
  confirmCloneAdventure(){
    confirm('¿Seguro que desea clonar esta aventura?') && this.cloneAdventure();
    
  }
  cloneAdventure(){
    this.loadingClone = true;
    let user_id = this.user._id
    this.adventureService.cloneAdventure(this.adventure._id,user_id).subscribe(
      response => {
        console.log(response)
        this.loadingClone = false;
        this.toastr.success("La aventura ha sido clonado exitosamente, los recursos pueden tardar unos minutos en cargarse","Éxito",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['select'],{ state: { type: 'clone' }});
        this.loadingClone = false;
      },
      err => {
        this.toastr.error("La aventura seleccionada no ha podido ser clonada", "Error en la clonación", {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.loadingClone = false;
      }
    );
  }

  confirmCollaborateRequest(): void {
    confirm("¿Seguro/a que desea solicitar colaborar en esta aventura?") && this.requestCollaboration();
  }
  checkCollabInvitation(){
    this.invitationService.checkExistingInvitation(this.user._id, this.adventure._id).subscribe(
      response => {
        if(response.message === "NOT_EXISTING_INVITATION")
          this.existingInvitation = false;
        else
          this.existingInvitation = true;
      },
      err => {
        console.log(err)
      }
    );
  }
  requestCollaboration(){
    let invitation = {
      user: this.user,
      adventure: this.adventure,
    }
    this.invitationService.requestCollab(invitation).subscribe(
      response => {
        this.toastr.success("Se ha enviado correctamente la solicitud de colaboración, se le notificará la respuesta","Éxito",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.checkCollabInvitation();

      },
      err =>{
        console.log(err)
        this.toastr.error("No se ha podido enviar la solicitud de colaboración, intente más tarde","Error",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });

      }
    );
  }

}
