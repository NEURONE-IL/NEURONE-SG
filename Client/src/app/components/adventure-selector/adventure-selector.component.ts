import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AdventureService } from 'src/app/services/game/adventure.service';
import { EditorService } from 'src/app/services/game/editor.service';
import { GameService } from 'src/app/services/game/game.service';

@Component({
  selector: 'app-adventure-selector',
  templateUrl: './adventure-selector.component.html',
  styleUrls: ['./adventure-selector.component.scss'],
})
export class AdventureSelectorComponent implements OnInit {
  adventures: any;
  role: any;

  constructor(
    private adventureService: AdventureService,
    private auth: AuthService,
    private editorService: EditorService,
    private gameService: GameService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.role = this.auth.getRole();
    this.adventureService.getAdventures().subscribe(
      (res) => {
        this.adventures = res;
        console.log(this.adventures);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  play(adventure: any) {
    this.gameService.init(adventure);
    this.router.navigate(['game']);
  }

  edit(adventure: any) {
    this.editorService.init(adventure);
    this.router.navigate(['editor']);
  }
}
