import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      let url: string = state.url;
      return this.checkUserLogin(next, url);
  }


  checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
    if (this.auth.getUser()) {
      const userRole = this.auth.getRole();
      console.log('user role:', userRole);
      if (route.data.role && route.data.role.indexOf(userRole) === -1) {
        this.router.navigate(['/select']);
        return false;
      }
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
