import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchInterfaceComponent } from './components/search-interface/search-interface.component';
import { AdventureComponent } from './components/adventure/adventure.component';
import { AdventureEditorComponent } from './components/adventure-editor/adventure-editor.component';
import { NewNodeDialogComponent } from "./components/adventure-editor/dialogs/NewNodeDialogComponent";
import { NewLinkDialogComponent } from "./components/adventure-editor/dialogs/NewLinkDialogComponent";
import { ChallengeDialogComponent } from "./components/adventure-editor/dialogs/ChallengeDialogComponent";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgxGraphModule } from '@swimlane/ngx-graph';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { GameComponent } from './views/game/game.component';
import { MatGridListModule } from '@angular/material/grid-list'
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { MatMenuModule } from '@angular/material/menu';
import { LayoutModule } from '@angular/cdk/layout';
import { EditorComponent } from './views/editor/editor.component';
import { GameBarComponent } from './components/game-bar/game-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './components/header/header.component';
import { AdventureMetaEditorComponent } from './components/adventure-meta-editor/adventure-meta-editor.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    AppComponent,
    AdventureComponent,
    AdventureEditorComponent,
    SearchInterfaceComponent,
    GameComponent,
    DashboardComponent,
    EditorComponent,
    GameBarComponent,
    HeaderComponent,
    AdventureMetaEditorComponent,
    NewNodeDialogComponent,
    NewLinkDialogComponent,
    ChallengeDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    NgxGraphModule,
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatGridListModule,
    FlexLayoutModule,
    MatMenuModule,
    LayoutModule,
    MatToolbarModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDividerModule,
    MatListModule,
    MatTabsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
