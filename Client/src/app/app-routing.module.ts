import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { EditorComponent } from './views/editor/editor.component';
import { GameComponent } from './views/game/game.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'game',
        component: GameComponent
      },
      {
        path: 'editor',
        component: EditorComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
