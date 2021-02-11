import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchInterfaceComponent } from './components/search-interface/search-interface.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { ViewPageComponent } from './components/view-page/view-page.component';
import { AdventureSelectionComponent } from './views/adventure-selection/adventure-selection.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { EditorComponent } from './views/editor/editor.component';
import { GameComponent } from './views/game/game.component';
import { LoginRegisterComponent } from './views/login-register/login-register.component';
import { AuthGuard } from './helpers/guards/auth.guard';
import { NotLoggedInGuard } from './helpers/guards/not-logged-in.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: 'select'
  },
  {
    path: 'game',
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    },
    component: EditorComponent,
  },
  {
    path: 'login',
    canActivate: [NotLoggedInGuard],
    component: LoginRegisterComponent,
  },
  {
    path: 'select',
    canActivate: [AuthGuard],
    component: AdventureSelectionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
