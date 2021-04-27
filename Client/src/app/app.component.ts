import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth/auth.service';
import { StoreLinkService } from './services/tracking/store-link.service';
import { ConfigService } from './services/game/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  title = 'NEURONE-SG';
  config: any;

  constructor(
    public translate: TranslateService,
    private router: Router,
    private storeLink: StoreLinkService,
    private auth: AuthService,
    private configService: ConfigService
  ) {
    translate.addLangs(['es', 'en']);
    translate.setDefaultLang('es');
    translate.use('es');
  }
  async ngOnInit(): Promise<void> {
    await this.fetchConfig();
    if(this.config.LinksTracking) {
      this.trackVisitedLinks();
    }
  }

  private trackVisitedLinks() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
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

  async fetchConfig() {
    await this.configService
      .getConfig()
      .toPromise()
      .then((config) => {
        this.config = config;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
