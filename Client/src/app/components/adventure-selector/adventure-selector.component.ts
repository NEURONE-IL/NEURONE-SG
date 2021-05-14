import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AdventureService } from 'src/app/services/game/adventure.service';
import { EditorService } from 'src/app/services/game/editor.service';
import { GameService } from 'src/app/services/game/game.service';
import { ProgressService } from 'src/app/services/game/progress.service';
import { SearchService } from 'src/app/services/search/search.service';
import { NewAdventureDialogComponent } from './dialogs/new-adventure/new-adventure-dialog.component';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-adventure-selector',
  templateUrl: './adventure-selector.component.html',
  styleUrls: ['./adventure-selector.component.scss'],
})
export class AdventureSelectorComponent implements OnInit {
  adventures: any;
  role: any;
  userProgress: any;

  gamified = false;
  connected = false;

  GMloading = true;
  adventuresLoading = true;

  apiUrl = environment.apiUrl;

  constructor(
    private adventureService: AdventureService,
    private auth: AuthService,
    private editorService: EditorService,
    private gameService: GameService,
    private searchService: SearchService,
    public router: Router,
    public newAdventureDialog: MatDialog,
    private progresService: ProgressService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.role = this.auth.getRole();
    const playerId = this.auth.getUser()._id;
    if (this.role == 'player') {
      this.fetchPlayableAdventures(playerId);
    } else {
      this.fetchAllAdventures();
    }
  }

  private fetchAllAdventures() {
    this.adventureService.getAdventures().subscribe(
      (res) => {
        this.adventures = res;
        if (this.auth.getRole() == 'player') {
          let user = this.auth.getUser();
          this.progresService.getUserProgress(user._id).subscribe(
            (res) => {
              this.userProgress = res;
              console.log('user progress: ', this.userProgress);
              this.validateProgress();
              this.adventuresLoading = false;
            },
            (err) => {
              this.adventuresLoading = false;
            }
          );
        } else {
          this.adventuresLoading = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  private fetchPlayableAdventures(playerId: any) {
    this.adventureService.getPlayerAdventures(playerId).subscribe(
      (res) => {
        this.adventures = res;
        if (this.auth.getRole() == 'player') {
          let user = this.auth.getUser();
          this.progresService.getUserProgress(user._id).subscribe(
            (res) => {
              this.userProgress = res;
              console.log('user progress: ', this.userProgress);
              this.validateProgress();
              this.adventuresLoading = false;
            },
            (err) => {
              this.adventuresLoading = false;
            }
          );
        } else {
          this.adventuresLoading = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async play(adventure: any) {
    await this.gameService.init(adventure).then(() => {
      this.searchService.init();
      this.router.navigate(['game']);
    });
  }

  async resume(adventure: any) {
    await this.gameService.resume(adventure).then(() => {
      this.searchService.init();
      this.router.navigate(['game']);
    });
  }

  async edit(adventure: any) {
    await this.editorService.init(adventure).then(() => {
      this.router.navigate(['editor']);
    });
  }

  validateProgress() {
    this.userProgress.forEach((progress) => {
      let foundIdx = this.adventures.findIndex(
        (adv) => adv._id == progress.adventure
      );
      this.adventures[foundIdx].progress = progress;
    });
    this.adventures.sort((adv1, adv2) =>
      adv1.progress && !adv2.progress ? -1 : 1
    );
    this.adventures = this.adventures.filter((adventure) => {
      return (
        (adventure.progress && !adventure.progress.finished) ||
        !adventure.progress
      );
    });
  }

  deleteAdventure(adventure: any) {
    this.translate.get('WARNINGS').subscribe((res) => {
      if (confirm(res.DELETE_ADVENTURE)) {
        this.adventureService.deleteAdventure(adventure).subscribe(
          (res) => {
            this.translate.get('SELECTOR.TOASTR').subscribe((res) => {
              this.toastr.success(res.DELETE_SUCCESS);
            });
            this.reloadPage();
          },
          (err) => {
            this.translate.get('SELECTOR.TOASTR').subscribe((res) => {
              this.toastr.error(res.DELETE_FAILURE);
            });
            console.log(err);
          }
        );
      }
    });
  }

  showNewAdventureDialog(): void {
    const nodeDialogRef = this.newAdventureDialog.open(
      NewAdventureDialogComponent,
      {
        width: '50rem',
        height: 'auto',
      }
    );

    nodeDialogRef.afterClosed().subscribe((result) => {
      console.log('closed adventureDialog');
      if (result && result.newAdventure) {
        console.log('new adventure: ', result.newAdventure);
        this.adventureService.createAdventure(result.newAdventure).subscribe(
          (res) => {
            this.translate.get('NEW_ADVENTURE.TOASTR').subscribe((res) => {
              this.toastr.success(res.SUCCESS);
            });
            this.reloadPage();
          },
          (err) => {
            this.translate.get('NEW_ADVENTURE.TOASTR').subscribe((res) => {
              this.toastr.error(res.FAILURE);
            });
            console.log(err);
          }
        );
      }
    });
  }

  reloadPage(): void {
    this.ngOnInit();
  }
}
