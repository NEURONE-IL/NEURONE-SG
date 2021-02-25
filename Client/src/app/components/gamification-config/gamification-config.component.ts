import { Component, OnInit } from '@angular/core';
import { GamificationService } from 'src/app/services/game/gamification.service';

@Component({
  selector: 'app-gamification-config',
  templateUrl: './gamification-config.component.html',
  styleUrls: ['./gamification-config.component.scss']
})
export class GamificationConfigComponent implements OnInit {

  gamified = false;
  connected = false;

  GMloading = true;

  constructor(
    private gmService: GamificationService
  ) { }

  ngOnInit(): void {
    this.gamificationStatus();
  }

  gamificationStatus() {
    this.gmService.gamificationStatus().subscribe(
      (response) => {
        this.gamified = response.gamified;
        this.connected = response.connected;
        this.GMloading = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  gamify() {
    this.GMloading = true;
    if (!this.gamified) {
      this.gmService.gamify().subscribe(
        (response) => {
          console.log(response);
          this.gmService.gamifyDependent().subscribe(
            (response2) => {
              console.log(response2);
              this.GMloading = false;
            },
            (err) => {
              console.log(err);
            }
          );
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

}
