import { Component, OnInit,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AdventureService } from 'src/app/services/game/adventure.service';
import { EditorService } from 'src/app/services/game/editor.service';
import { GameService } from 'src/app/services/game/game.service';
import { ProgressService } from 'src/app/services/game/progress.service';
import { SearchService } from 'src/app/services/search/search.service';
import { NewAdventureDialogComponent } from './dialogs/new-adventure/new-adventure-dialog.component';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar,MatSnackBarRef } from '@angular/material/snack-bar';
import { CustomSnackBarComponent } from './snackbar/CustomSnackBarComponent'
import { Subject } from 'rxjs';

const ADVENTURE_KEY = 'adventureId';

@Component({
  selector: 'app-adventure-selector',
  templateUrl: './adventure-selector.component.html',
  styleUrls: ['./adventure-selector.component.scss'],
})
export class AdventureSelectorComponent implements OnInit, OnDestroy {
  adventures: any;
  role: any;
  userProgress: any;

  gamified = false;
  connected = false;

  GMloading = true;
  adventuresLoading = true;

  apiUrl = environment.apiUrl;

  //Valentina
  indexTab:number = 0;
  acceptSubscription :boolean = false;
  editUsers: any[][] = [];


  constructor(
    private adventureService: AdventureService,
    private auth: AuthService,
    private editorService: EditorService,
    private gameService: GameService,
    private searchService: SearchService,
    public router: Router,
    public newAdventureDialog: MatDialog,
    private progresService: ProgressService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private changeDetection: ChangeDetectorRef
  ) {
    let state = this.router.getCurrentNavigation().extras.state
    if(state){
      console.log(state);
      this.indexTab = 3;
    }
  }

  ngOnInit(): void {
    this.role = this.auth.getRole();
    const playerId = this.auth.getUser()._id;
    this.initEditUsers()
    if (this.role == 'player') {
      this.fetchPlayableAdventures(playerId);
    } else {
      this.onTabClick({index:this.indexTab})
    }
    sessionStorage.removeItem(ADVENTURE_KEY);
  }
  ngOnDestroy(): void {
    this.adventureService.closeAllEventSources();
  }

  private fetchAllAdventures(playerId) {
    this.adventureService.getAdventuresByUser(playerId).subscribe(
      (res) => {
        this.adventures = res.adventures;
        console.log(res)
        this.createEditUsers();
        if (this.auth.getRole() == 'player') {
          let user = this.auth.getUser();
          this.progresService.getUserProgress(user._id).subscribe(
            (res) => {
              this.userProgress = res;
              console.log('user progress: ', this.userProgress);
              this.validateProgress();
              this.adventuresLoading = false;
            },
            (err) => {
              this.adventuresLoading = false;
            }
          );
        } else {
          this.adventuresLoading = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private fetchPlayableAdventures(playerId: any) {
    this.adventureService.getPlayerAdventures(playerId).subscribe(
      (res) => {
        this.adventures = res;
        if (this.auth.getRole() == 'player') {
          let user = this.auth.getUser();
          this.progresService.getUserProgress(user._id).subscribe(
            (res) => {
              this.userProgress = res;
              this.validateProgress();
              this.adventuresLoading = false;
            },
            (err) => {
              this.adventuresLoading = false;
            }
          );
        } else {
          this.adventuresLoading = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async play(adventure: any) {
    await this.gameService.init(adventure).then(() => {
      this.searchService.init();
      this.router.navigate(['game']);
    });
  }

  async resume(adventure: any) {
    await this.gameService.resume(adventure).then(() => {
      this.searchService.init();
      this.router.navigate(['game']);
    });
  }

  async edit(adventure: any) {
    await this.editorService.init(adventure).then(() => {
      this.router.navigate(['editor']);
    });
  }

  validateProgress() {
    this.userProgress.forEach((progress) => {
      let foundIdx = this.adventures.findIndex(
        (adv) => adv._id == progress.adventure
      );
      if (foundIdx >= 0 && this.adventures[foundIdx]) {
        this.adventures[foundIdx].progress = progress;
      }
    });
    this.adventures.sort((adv1, adv2) =>
      adv1.progress && !adv2.progress ? -1 : 1
    );
    this.adventures = this.adventures.filter((adventure) => {
      return (
        (adventure.progress && !adventure.progress.finished) ||
        !adventure.progress
      );
    });
  }

  deleteAdventure(adventure: any) {
    this.translate.get('WARNINGS').subscribe((res) => {
      if (confirm(res.DELETE_ADVENTURE)) {
        this.adventureService.deleteAdventure(adventure).subscribe(
          (res) => {
            this.translate.get('SELECTOR.TOASTR').subscribe((res) => {
              this.toastr.success(res.DELETE_SUCCESS);
            });
            this.onTabClick({index:this.indexTab})
          },
          (err) => {
            this.translate.get('SELECTOR.TOASTR').subscribe((res) => {
              this.toastr.error(res.DELETE_FAILURE);
            });
            console.log(err);
          }
        );
      }
    });
  }

  showNewAdventureDialog(): void {
    const nodeDialogRef = this.newAdventureDialog.open(
      NewAdventureDialogComponent,
      {
        width: '50rem',
        height: 'auto',
      }
    );

    nodeDialogRef.afterClosed().subscribe((result) => {
      console.log('closed adventureDialog');
      if (result && result.newAdventure) {
        console.log('new adventure: ', result.newAdventure);
        this.adventureService.createAdventure(result.newAdventure).subscribe(
          (res) => {
            this.translate.get('NEW_ADVENTURE.TOASTR').subscribe((res) => {
              this.toastr.success(res.SUCCESS);
            });
            this.reloadPage();
          },
          (err) => {
            this.translate.get('NEW_ADVENTURE.TOASTR').subscribe((res) => {
              this.toastr.error(res.FAILURE);
            });
            console.log(err);
          }
        );
      }
    });
  }
  reloadPage(): void {
    this.ngOnInit();
  }

  //Valentina
  onTabClick(event) {
    let index = event.index;
    this.indexTab = index;
    const userId = this.auth.getUser()._id;
    switch(index) { 
      case 0: { 
        this.fetchAllAdventures(userId);
        break; 
      } 
      case 1: { //Privados
        var privacy = true;
        let params = {user: userId, privacy: privacy};
        this.fetchAdventuresByPrivacy(params); 
        break; 
      } 
      case 2: { //Publicos
        var privacy = false;
        let params = {user: userId, privacy: privacy};
        this.fetchAdventuresByPrivacy(params);
        break; 
      } 
      case 3: { 
        var type = 'clone';
        let params = {user: userId, type: type};
        this.fetchAdventuresByType(params)
        break; 
      }
      case 4: { 
        this.fetchAdventuresByCollaboration(userId);
        break; 
      }
      default: { 
         //statements; 
         break; 
      } 
   }
  }
  private fetchAdventuresByPrivacy(params: any) {
    this.adventureService.getAdventuresByUserByPrivacy(params).subscribe(
      (res) => {
        this.adventures = res.adventures;
        this.createEditUsers();

        if (this.auth.getRole() == 'player') {
          let user = this.auth.getUser();
          this.progresService.getUserProgress(user._id).subscribe(
            (res) => {
              this.userProgress = res;
              console.log('user progress: ', this.userProgress);
              this.validateProgress();
              this.adventuresLoading = false;
            },
            (err) => {
              this.adventuresLoading = false;
            }
          );
        } else {
          this.adventuresLoading = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private fetchAdventuresByType(params: any) {
    this.adventureService.getAdventuresByUserByType(params).subscribe(
      (res) => {
        this.adventures = res.adventures;
        console.log(res.adventures);
        this.createEditUsers();

        if (this.auth.getRole() == 'player') {
          let user = this.auth.getUser();
          this.progresService.getUserProgress(user._id).subscribe(
            (res) => {
              this.userProgress = res;
              console.log('user progress: ', this.userProgress);
              this.validateProgress();
              this.adventuresLoading = false;
            },
            (err) => {
              this.adventuresLoading = false;
            }
          );
        } else {
          this.adventuresLoading = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private fetchAdventuresByCollaboration(userId) {
    this.adventureService.getAdventuresByUserCollaboration(userId).subscribe(
      (res) => {
        this.adventures = res.adventures;
        console.log(res.adventures);
        this.createEditUsers();

        if (this.auth.getRole() == 'player') {
          let user = this.auth.getUser();
          this.progresService.getUserProgress(user._id).subscribe(
            (res) => {
              this.userProgress = res;
              console.log('user progress: ', this.userProgress);
              this.validateProgress();
              this.adventuresLoading = false;
            },
            (err) => {
              this.adventuresLoading = false;
            }
          );
        } else {
          this.adventuresLoading = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  confirmCollaborationLeft(adventure){
    confirm('Seguro que desea dejar de ser colaborador en la aventura: '+adventure.name) && this.collaborationLeft(adventure);
  }
  collaborationLeft(adventure){
    let user = this.auth.getUser();
    let collaborators = adventure.collaborators.slice();
    let index = collaborators.findIndex(coll => coll.user._id === user._id)
    collaborators.splice(index,1);
    console.log(collaborators)
    this.editCollaborator(adventure,collaborators,"Ha dejado de ser colaborador de la aventura: "+adventure.name,"No se ha podido realizar la operación, intente más tarde");
  }
  editCollaborator(adventure,collaboratorList, msg1, msg2){
    this.adventureService.editCollaboratorAdventure(adventure._id, collaboratorList).subscribe(
      response => {
        this.toastr.success(msg1, "Éxito",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.onTabClick({index:4})
      },
      err => {
        this.toastr.error(msg2, "Error",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.onTabClick({index:4})
      }
    );
  }
  requestEdit(adventure,i){
    let user_id = this.auth.getUser()._id;
    this.adventureService.requestForEdit(adventure._id,{user:user_id}).subscribe(
      response => {
        let userEdit = response.userEdit;
        if(userEdit._id != user_id){
          this.subsToEdit(adventure,user_id,userEdit,i);
        }
        else{
          this.edit(adventure)
        }
      },
      err => {
        console.log(err);
      }
    )
  }
  releaseAdventure(adventure){
    let user_id = this.auth.getUser()._id;
    this.adventureService.releaseForEdit(adventure._id, {user:user_id}).subscribe(
      res => {
        console.log(res.message);
      },
      err => {
        console.log(err)
      }
    );
  }
  updateStatusForm(editUser,adventure){
    let user_id = this.auth.getUser()._id;
    if(editUser == undefined){
      console.log('Puede editar!')
      this.toastr.info('La aventura: '+adventure.name+' puede ser editada ahora', 'Información', {
        timeOut: 5000,
        positionClass: 'toast-top-center'
      });
      this.adventureService.closeEventSourcebyUrl(adventure._id,user_id);
    }
  }
  preEdit(adv,i){
    this.adventureService.getAdventure(adv._id).subscribe( async response => {
      this.requestEdit(await response,i);
    },
    err => {
      console.log(err)
    })
  }
  subsToEdit(adventure, user_id,currentUser,i) {
    console.log('No puede editar');

    let snackBarRef = this.snackBar.openFromComponent(CustomSnackBarComponent, {
        data:{adventure:adventure},
        duration: 10 * 1000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        
    })
    snackBarRef.afterDismissed().subscribe(data => {
      let subs = data.dismissedByAction;
      if(subs){
        let userEdit: any = {};
        let currentEdit = {user:currentUser.username, adventure:adventure._id}
        this.editUsers[this.indexTab][i] = currentEdit;
        this.changeDetection.detectChanges();

        this.adventureService.getServerSentEvent(adventure._id, user_id).subscribe(
          response => {
            let data = JSON.parse(response.data);
            userEdit = data.currentUser;
            if(userEdit != undefined){
              console.log('Para adventure: %s current user edit: %s',adventure.name, userEdit.username);
            }
            else{
              this.editUsers[this.indexTab][i] = undefined;
              this.updateStatusForm(userEdit,adventure);
            }
          },
          err => {
            console.log(err)
          }
        );
      }
    })
  }
  createEditUsers(){
    this.adventures.forEach(adv => {
      this.editUsers[this.indexTab].push(undefined)
    });
  }
  initEditUsers(){
    for (var i = 0; i < 5; i++) {
      this.editUsers.push([])
   }
  }
  goToStatics(adventure: any) {
    this.router.navigate([`adventures-search/adventure/${adventure._id}/statics`]);
  }
  
}
