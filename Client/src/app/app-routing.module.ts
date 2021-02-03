import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchInterfaceComponent } from './components/search-interface/search-interface.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { AdventureSelectionComponent } from './views/adventure-selection/adventure-selection.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { EditorComponent } from './views/editor/editor.component';
import { GameComponent } from './views/game/game.component';
import { LoginRegisterComponent } from './views/login-register/login-register.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'game',
        component: GameComponent,
        children: [
          {
            path: '',
            component: SearchInterfaceComponent,
          },
          {
            path: 'results',
            component: SearchResultsComponent,
          },
          // {
          //   path: 'view-page',
          //   component: ViewPageComponent
          // }
        ],
      },
      {
        path: 'editor',
        component: EditorComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'login',
        component: LoginRegisterComponent,
      },
      {
        path: 'select',
        component: AdventureSelectionComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
