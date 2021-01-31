import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AdventureService } from 'src/app/services/game/adventure.service';

@Component({
  selector: 'app-adventure-selector',
  templateUrl: './adventure-selector.component.html',
  styleUrls: ['./adventure-selector.component.scss'],
})
export class AdventureSelectorComponent implements OnInit {

  adventures: any;
  role: any;

  constructor(private adventureService: AdventureService,
    private auth: AuthService) {}

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
}
