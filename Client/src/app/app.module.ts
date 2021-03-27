import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchInterfaceComponent } from './components/search-interface/search-interface.component';
import { AdventureComponent } from './components/adventure/adventure.component';
import { AdventureEditorComponent } from './components/adventure-editor/adventure-editor.component';
import { NewNodeDialogComponent } from './components/editor-dialogs/new-node-dialog/NewNodeDialogComponent';
import { NewLinkDialogComponent } from './components/editor-dialogs/new-link-dialog/NewLinkDialogComponent';
import { LinksTableDialog } from './components/editor-dialogs/links-table-dialog/LinksTableDialog';
import { ChallengeDialogComponent } from './components/editor-dialogs/challenge-dialog/ChallengeDialogComponent';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { authInterceptorProviders } from './helpers/auth.interceptor';

import { NgxGraphModule } from '@swimlane/ngx-graph';
import { ToastrModule } from 'ngx-toastr';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { GameComponent } from './views/game/game.component';
import { MatGridListModule } from '@angular/material/grid-list';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileUploadModule } from 'ng2-file-upload';
import { QuestionFormComponent } from './components/game-bar/question-form/question-form.component';
import { MultipleFormComponent } from './components/game-bar/multiple-form/multiple-form.component';
import { SynthesisFormComponent } from './components/game-bar/synthesis-form/synthesis-form.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LoginRegisterComponent } from './views/login-register/login-register.component';
import { LoginCardComponent } from './components/login-card/login-card.component';
import { RegisterCardComponent } from './components/register-card/register-card.component';
import { AdventureSelectorComponent } from './components/adventure-selector/adventure-selector.component';
import { AdventureSelectionComponent } from './views/adventure-selection/adventure-selection.component';
import { NewAdventureDialogComponent } from './components/adventure-selector/dialogs/new-adventure/new-adventure-dialog.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { ViewPageComponent } from './components/view-page/view-page.component';
import { SafeurlPipe } from './helpers/safeUrl/safeurl.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { WebResourcesTableDialogComponent } from './components/web-resources-dialogs/web-resources-table-dialog/web-resources-table-dialog.component';
import { NewWebResourceDialogComponent } from './components/web-resources-dialogs/new-web-resource-dialog/new-web-resource-dialog.component';
import { GamificationConfigComponent } from './components/gamification-config/gamification-config.component';
import { GeneralConfigComponent } from './components/general-config/general-config.component';
import { MatFileUploadModule } from 'angular-material-fileupload';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
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
    LinksTableDialog,
    ChallengeDialogComponent,
    QuestionFormComponent,
    MultipleFormComponent,
    NewAdventureDialogComponent,
    SynthesisFormComponent,
    LoginRegisterComponent,
    LoginCardComponent,
    RegisterCardComponent,
    AdventureSelectorComponent,
    AdventureSelectionComponent,
    SearchResultsComponent,
    ViewPageComponent,
    SafeurlPipe,
    WebResourcesTableDialogComponent,
    NewWebResourceDialogComponent,
    GamificationConfigComponent,
    GeneralConfigComponent,
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
    MatFileUploadModule,
    FlexLayoutModule,
    MatMenuModule,
    LayoutModule,
    MatToolbarModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDividerModule,
    MatListModule,
    MatTabsModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTooltipModule,
    FileUploadModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
