import { Component } from '@angular/core';
import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth/auth.service';
import { StoreLinkService } from './services/tracking/store-link.service';
import { StoreSessionService } from './services/tracking/store-session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'NEURONE-ADVENTURE';

  constructor(
    public translate: TranslateService,
    private router: Router,
    private storeLink: StoreLinkService,
    private auth: AuthService
  ) {
    translate.addLangs(['es', 'en']);
    translate.setDefaultLang('es');
    translate.use('es');

    this.trackVisitedLinks();
  }

  private trackVisitedLinks() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log('NAVIGATION STARTS!!!!!!!!!!!!!!!!!!!');
        if (this.auth.getUser() && this.auth.getUser().role == 'player') {
          let visitedLink = {
            url: event.url,
            state: 'PageEnter',
            title: document.title,
            localTimeStamp: Date.now(),
          };
          this.storeLink.postVisitedLink(visitedLink);
        }
      }

      if (event instanceof NavigationEnd) {
        console.log('NAVIGATION ENDSSS!!!!!!!!!!!!!!!!!!!');
        if (this.auth.getUser() && this.auth.getUser().role == 'player') {
          let visitedLink = {
            url: event.url,
            state: 'PageExit',
            title: document.title,
            localTimeStamp: Date.now(),
          };
          this.storeLink.postVisitedLink(visitedLink);
        }
      }

      if (event instanceof NavigationError) {
        console.log(event.error);
      }
    });
  }
}
