import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  Router
} from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AdventureService } from 'src/app/services/game/adventure.service';
import { EditorService } from '../../services/game/editor.service';
import { ServiceLocator } from '../../services/locator.service';
import { Observable, Subscription } from 'rxjs';

export interface ComponentCanDeactivate { 
  canDeactivate: () => boolean | Observable<boolean>;
  exitMessage: string;
}

@Injectable({
  providedIn: 'root',
})

export class CanExitGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(
    component: ComponentCanDeactivate,
  ): boolean | Observable<boolean> {
    const router: Router = ServiceLocator.injector.get(Router);
  
    let path = router.url
    if(path !== '/editor')
      return component.canDeactivate() ? true : confirm(component.exitMessage);
    else if((path === '/editor')){
      let status = confirm(component.exitMessage)
      if(status){
        let auth = ServiceLocator.injector.get(AuthService);
        let editorService = ServiceLocator.injector.get(EditorService)
        let adventureService = ServiceLocator.injector.get(AdventureService)
        let adventureSubscription: Subscription;
        
        adventureSubscription = editorService.adventureEmitter.subscribe(
          (adventure) => {
            if(adventure != undefined){
              let adv = adventure;
              let user_id = auth.getUser()._id;
              adventureService.releaseForEdit(adv._id, {user:user_id}).subscribe(
                adventure => {
                  console.log('Adventure Release');
                  adventureSubscription.unsubscribe();
                },
                err => {
                  console.log(err)
                  adventureSubscription.unsubscribe();
                }
              );
            }
            
          }
        );
      }
      /*else if(status === undefined || status === null){
        let auth = ServiceLocator.injector.get(AuthService)
        let editorService = ServiceLocator.injector.get(EditorService)
        let adventureService = ServiceLocator.injector.get(AdventureService)
        let adventureSubscription: Subscription;
        
        adventureSubscription = editorService.adventureEmitter.subscribe(
          (adventure) => {
            let adv = adventure;
            let user_id = auth.getUser()._id;
            adventureService.releaseForEdit(adv._id, {user:user_id}).subscribe(
              adventure => {
                console.log('Adventure Release');
              },
              err => {
                console.log(err)
              }
            );
          }
        );
      }*/
      return component.canDeactivate() ? true : status;
      
    }

  }
}
