import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
  exitMessage: string;
}

@Injectable({
  providedIn: 'root',
})
export class CanExitGuard implements CanDeactivate<ComponentCanDeactivate> {

  canDeactivate(
    component: ComponentCanDeactivate
  ): boolean | Observable<boolean> {
    return component.canDeactivate() ? true : confirm(component.exitMessage);
  }
}
