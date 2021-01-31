import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
