import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchInterfaceComponent } from './components/search-interface/search-interface.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { ViewPageComponent } from './components/view-page/view-page.component';
import { AdventureSelectionComponent } from './views/adventure-selection/adventure-selection.component';
import { EditorComponent } from './views/editor/editor.component';
import { GameComponent } from './views/game/game.component';
import { LoginRegisterComponent } from './views/login-register/login-register.component';
import { AuthGuard } from './helpers/guards/auth.guard';
import { AdminGuard } from './helpers/guards/admin.guard';
import { NotLoggedInGuard } from './helpers/guards/not-logged-in.guard';
import { DirectAccessGuard } from './helpers/guards/direct-access.guard';
import { ProfileComponent } from './views/profile/profile.component';
import { CanExitGuard } from './helpers/guards/can-exit.guard';
import { LoginRedirectComponent } from './views/login-redirect/login-redirect.component';
import { AdventuresSearchComponent } from './views/adventures-search/adventures-search.component';
import { AdventuresSearchResultsComponent } from './components/adventures-search-results/adventures-search-results.component';
import { AdventureSearchDisplayComponent } from './components/adventure-search-display/adventure-search-display.component';
import { AdventureSearchDisplayGuard} from './helpers/guards/adventure-search-display.guard'
import { StaticsComponent } from './components/statics/statics.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: 'select',
  },
  {
    path: 'game',
    canActivate: [AuthGuard, DirectAccessGuard],
    canDeactivate: [CanExitGuard],
    component: GameComponent,
    children: [
      {
        path: '',
        component: SearchInterfaceComponent,
      },
      {
        path: 'results/:query',
        component: SearchResultsComponent,
      },
      {
        path: 'view-page/:path',
        component: ViewPageComponent,
      },
    ],
  },
  {
    path: 'editor',
    canActivate: [AuthGuard, DirectAccessGuard],
    canDeactivate: [CanExitGuard],
    data: {
      role: ['admin', 'creator'],
    },
    component: EditorComponent,
  },
  {
    path: 'login',
    canActivate: [NotLoggedInGuard],
    component: LoginRegisterComponent,
  },
  {
    path: 'adventures-search',
    component: AdventuresSearchComponent,
    canActivate: [ AuthGuard, AdminGuard ],
    children: [
      {
        path: 'results/:term',
        component: AdventuresSearchResultsComponent
      },
      {
        path: 'adventure/:adventure_id',
        component: AdventureSearchDisplayComponent,
        canActivate:[AdventureSearchDisplayGuard]
      },
      {
        path: 'adventure/:adventure_id/statics',
        canActivate: [AuthGuard],
        component: StaticsComponent,
      }
    ]
  },
  {
    path: 'select',
    canActivate: [AuthGuard],
    component: AdventureSelectionComponent,
  },
  
  {
    path: 'profile',
    canActivate: [AuthGuard],
    data: {
      role: ['player'],
    },
    component: ProfileComponent,
  },
  {
    path: 'login_redirect/:email/:username/:adventure/:trainer_id/:api_key/:url',
    component: LoginRedirectComponent
  },
  { path: '**', redirectTo: 'select' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
