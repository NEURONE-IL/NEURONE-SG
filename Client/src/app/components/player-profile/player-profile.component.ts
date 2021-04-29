import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GamificationService } from 'src/app/services/game/gamification.service';
import { AvatarSelectorComponent } from '../avatar-selector/avatar-selector.component';

// Player profile component
// Adapted from the original wotk of: TUTELAGE Project development team
// URL: https://github.com/JoseMellado/GAME
// Camila Marquez
// Jose Mellado
// Fernando Villarreal
// Cristobal Becerra

@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.scss'],
})
export class PlayerProfileComponent implements OnInit {
  progress;
  nearLevel;
  completedChallenges;
  actualLevel;
  points;
  user;
  ranks;
  studyOk = false;
  constructor(
    private gamificationService: GamificationService,
    private authService: AuthService,
    public dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.status();
  }

  getCompletedChallenges() {
    this.gamificationService
      .userCompletedChallenges(this.authService.getUser()._id)
      .subscribe(
        (response) => {
          this.completedChallenges = response;
          for (let i = 0; i < this.completedChallenges.length; i++) {
            this.completedChallenges[i].dateDisplay = new Date(
              this.completedChallenges[i].completion_date
            ).toLocaleDateString();
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getLevels() {
    this.gamificationService
      .userLevel(this.authService.getUser()._id)
      .subscribe(
        (response) => {
          let levels = response;
          this.actualLevel = levels[0];
          for (let i = 0; i < levels.length; i++) {
            if (levels[i].point_threshold < this.actualLevel.point_threshold) {
              this.actualLevel = levels[i];
            }
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getPoints() {
    this.gamificationService
      .userPoints(this.authService.getUser()._id)
      .subscribe(
        (response) => {
          this.points = response;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  levelProgress() {
    this.gamificationService
      .userLevelProgress(this.authService.getUser()._id)
      .subscribe(
        (response) => {
          this.progress = response;
          this.nearLevel = this.progress[0];
          for (let i = 1; i < this.progress.length; i++) {
            if (
              this.progress[i].point_threshold < this.nearLevel.point_threshold
            ) {
              this.nearLevel = this.progress[i];
            }
          }
          document
            .getElementById('progressLevel')
            .setAttribute(
              'data-label',
              this.nearLevel.amount +
                '/' +
                this.nearLevel.point_threshold +
                ' ' +
                this.nearLevel.point.name
            );
          document.getElementById('progressValue').style.width =
            (this.nearLevel.amount / this.nearLevel.point_threshold) * 100 +
            '%';
        },
        (err) => {
          console.log(err);
        }
      );
  }

  openImageSelector() {
    const avatarDialogRef = this.dialog.open(AvatarSelectorComponent);
    avatarDialogRef.afterClosed().subscribe((result) => {
      console.log('closed avatarDialog');
      if (result.avatar) {
        console.log(result);
      }
    });
  }

  rankings() {
    this.gamificationService
      .userRankings(this.authService.getUser()._id, 'ranking_exp')
      .subscribe(
        (response) => {
          let ranks = [];
          for (let i = 0; i < response.leaderboardResult.length; i++) {
            if (response.leaderboardResult[i].code === this.user.gm_code) {
              ranks.push(
                response.leaderboardResult[i].rank.toString() +
                  '° en cantidad de Experiencia'
              );
            }
          }
          this.ranks = ranks;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  status() {
    this.gamificationService.gamificationStatus().subscribe((response) => {
      if (response.gamified) {
        this.levelProgress();
        this.getCompletedChallenges();
        this.getLevels();
        this.getPoints();
        this.rankings();
      }
    });
  }

  play() {
    this.router.navigateByUrl('/start');
  }
}
