import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AdventureService } from 'src/app/services/game/adventure.service';

@Injectable({
  providedIn: 'root'
})
export class AdventureSearchDisplayGuard implements CanActivate {
  constructor(private authService: AuthService, private adventureService: AdventureService, private router: Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let owner: boolean;
    let colls: any;
    let privacy: boolean;
    let _user: any;
    const validation = async () => {
    await this.adventureService.getAdventure(next.paramMap.get('adventure_id')).toPromise()
      .then(response => {
        let adventure = response;
        _user = this.authService.getUser()._id
        owner = adventure.user._id === _user
        colls = adventure.collaborators
        privacy = adventure.privacy
      })
      .catch(err => {console.log(err); return this.router.navigate(['/select']) })
      
      if(owner){
        return this.router.navigate(['/select']);
      }
      else if(privacy){
        if(colls.findIndex( coll => (coll.invitation === 'Pendiente' && coll.user._id === _user)) >= 0)
          return true
        else
          return this.router.navigate(['/select']);
      }
      else{
        return true
      }  
    }
    return validation();
  }
}
