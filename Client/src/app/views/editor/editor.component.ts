import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { EditorService } from '../../services/game/editor.service';
import { CanExitGuard } from 'src/app/helpers/guards/can-exit.guard';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AdventureService } from 'src/app/services/game/adventure.service';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SubjectSubscriber } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, CanExitGuard, OnDestroy{
  adventureSubscription: Subscription;
  exitMessage: string;
  adventure: any;
  beforeUnload: boolean = false;


  constructor(public editorService: EditorService, 
              private translate: TranslateService,
              private auth: AuthService,
              private adventureService: AdventureService) {
                this.adventureSubscription = this.editorService.adventureEmitter.subscribe(
                  (adventure) => {
                    this.adventure = adventure;
                  }
                );
               }


  ngOnInit(): void {
    this.translate.get("EXIT_WARNINGS").subscribe(res => {
      this.exitMessage = res.EDITOR;
    });
  }
  ngOnDestroy(): void { 
      
  }
  saveAllFromParent() {
    console.log('save all from parent');
  }

  @HostListener('window:unload', ['$event'])
  async unload($event) {
    if(!this.beforeUnload)
      this.releaseAdventure(this.adventure);
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return false;
    }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event) {
    console.log($event)
    if (!this.canDeactivate()) {
      
      //$event.returnValue = this.exitMessage
      this.beforeUnload = true;
      this.editorService.updateAdventure();
      this.releaseAdventure(this.adventure);
  
    }
  }
  releaseAdventure(adventure){
    let user_id = this.auth.getUser()._id;
    this.adventureService.releaseForEdit(adventure._id, {user:user_id}).subscribe(
      adventure => {
        console.log('Adventure Release');
      },
      err => {
        console.log(err)
      }
    );
  }

}
