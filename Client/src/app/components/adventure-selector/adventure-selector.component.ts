import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AdventureService } from 'src/app/services/game/adventure.service';
import { EditorService } from 'src/app/services/game/editor.service';
import { GameService } from 'src/app/services/game/game.service';
import { SearchService } from 'src/app/services/search/search.service';
import { NewAdventureDialogComponent } from './dialogs/new-adventure/new-adventure-dialog.component';

@Component({
  selector: 'app-adventure-selector',
  templateUrl: './adventure-selector.component.html',
  styleUrls: ['./adventure-selector.component.scss'],
})
export class AdventureSelectorComponent implements OnInit {
  adventures: any;
  role: any;

  gamified = false;
  connected = false;

  GMloading = true;
  adventuresLoading = true;

  constructor(
    private adventureService: AdventureService,
    private auth: AuthService,
    private editorService: EditorService,
    private gameService: GameService,
    private searchService: SearchService,
    public router: Router,
    public newAdventureDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.role = this.auth.getRole();
    this.adventureService.getAdventures().subscribe(
      (res) => {
        this.adventures = res;
        this.adventuresLoading = false;
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

  async edit(adventure: any) {
    await this.editorService.init(adventure).then(() => {
      this.router.navigate(['editor']);
    });
  }

  deleteAdventure(adventure: any) {
    // await this.gameService.init(adventure).then(() => {
    //   this.searchService.init();
    //   this.router.navigate(['game']);
    // });
    this.adventureService.deleteAdventure(adventure).subscribe((res) => {
      console.log('adventure deleted');
      this.reloadPage();
    },
    (err) => {
      console.log(err);
    })
  }

  showNewAdventureDialog(): void {
    const nodeDialogRef = this.newAdventureDialog.open(
      NewAdventureDialogComponent,
      {
        width: '50rem',
        height: '20rem',
      }
    );

    nodeDialogRef.afterClosed().subscribe((result) => {
      console.log('closed adventureDialog');
      if (result.newAdventure) {
        console.log('new adventure: ', result.newAdventure);
        this.adventureService.createAdventure(result.newAdventure).subscribe(
          (res) => {
            this.reloadPage();
          },
          (err) => {
            console.log(err);
          }
        );
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
