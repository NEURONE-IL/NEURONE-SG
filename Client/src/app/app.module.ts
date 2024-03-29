import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { getDutchPaginatorIntl } from './components/paginatorInt/CustomPaginatorConfiguration';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchInterfaceComponent } from './components/search-interface/search-interface.component';
import { AdventureComponent } from './components/adventure/adventure.component';
import { AdventureEditorComponent } from './components/adventure-editor/adventure-editor.component';
import { NewNodeDialogComponent } from './components/editor-dialogs/new-node-dialog/NewNodeDialogComponent';
import { NewLinkDialogComponent } from './components/editor-dialogs/new-link-dialog/NewLinkDialogComponent';
import { LinksTableDialog } from './components/editor-dialogs/links-table-dialog/LinksTableDialog';
import { ChallengeDialogComponent } from './components/editor-dialogs/challenge-dialog/ChallengeDialogComponent';
import { WebResourcesSearchDialogComponent } from './components/adventure-search-display/adventure-node/web-resources-search-dialog/web-resources-search-dialog.component'
import { ChallengeViewComponent } from './components/adventure-search-display/adventure-node/challenge-view/ChallengeViewComponent';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { authInterceptorProviders } from './helpers/auth.interceptor';

import { NgxGraphModule } from '@swimlane/ngx-graph';
import { ToastrModule } from 'ngx-toastr';

import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips'; 
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
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
import { MatPaginatorModule,MatPaginatorIntl } from '@angular/material/paginator';
import { FileUploadModule } from 'ng2-file-upload';
import { QuestionFormComponent } from './components/game-bar/question-form/question-form.component';
import { MultipleFormComponent } from './components/game-bar/multiple-form/multiple-form.component';
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
import { EmbeddedMediaModule } from 'ngx-embedded-media';
import { BookmarkFormComponent } from './components/game-bar/bookmark-form/bookmark-form.component';
import { CustomPaginatorDirective } from './utils/custom-paginator.directive';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { PlayerProfileComponent } from './components/player-profile/player-profile.component';
import { ProfileComponent } from './views/profile/profile.component';
import { AvatarSelectorComponent } from './components/avatar-selector/avatar-selector.component';
import { InstructionsComponent } from './components/instructions/instructions.component';
import { LoginRedirectComponent } from './views/login-redirect/login-redirect.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { AdventuresSearchComponent } from './views/adventures-search/adventures-search.component';
import { AdventuresSearchResultsComponent } from './components/adventures-search-results/adventures-search-results.component';
import { AdventureSearchDisplayComponent } from './components/adventure-search-display/adventure-search-display.component';
import { AdventureNodeComponent } from './components/adventure-search-display/adventure-node/adventure-node.component';
import { AdventureDataComponent } from './components/adventure-search-display/adventure-data/adventure-data.component';
import { CustomSnackBarComponent } from './components/adventure-selector/snackbar/CustomSnackBarComponent';
import { ServiceLocator } from './services/locator.service';

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
    ChallengeViewComponent,
    QuestionFormComponent,
    MultipleFormComponent,
    NewAdventureDialogComponent,
    LoginRegisterComponent,
    LoginCardComponent,
    RegisterCardComponent,
    AdventureSelectorComponent,
    AdventureSelectionComponent,
    SearchResultsComponent,
    ViewPageComponent,
    SafeurlPipe,
    WebResourcesTableDialogComponent,
    WebResourcesSearchDialogComponent,
    NewWebResourceDialogComponent,
    GamificationConfigComponent,
    GeneralConfigComponent,
    BookmarkFormComponent,
    CustomPaginatorDirective,
    PaginatorComponent,
    PlayerProfileComponent,
    ProfileComponent,
    AvatarSelectorComponent,
    InstructionsComponent,
    LoginRedirectComponent,
    SearchBarComponent,
    AdventuresSearchComponent,
    AdventuresSearchResultsComponent,
    AdventureSearchDisplayComponent,
    AdventureNodeComponent,
    AdventureDataComponent,
    CustomSnackBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatBadgeModule,
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
    MatTabsModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    FileUploadModule,
    EmbeddedMediaModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [authInterceptorProviders,
              { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }, MatSnackBar],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private injector: Injector){
    ServiceLocator.injector = this.injector;
  }
}
