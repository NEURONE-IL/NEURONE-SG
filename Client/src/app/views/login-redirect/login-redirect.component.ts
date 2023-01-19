import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AdventureService } from 'src/app/services/game/adventure.service';
import { ConfigService } from 'src/app/services/game/config.service';
import { GameService } from 'src/app/services/game/game.service';
import { ProgressService } from 'src/app/services/game/progress.service';
import { SearchService } from 'src/app/services/search/search.service';
import { StoreSessionService } from 'src/app/services/tracking/store-session.service';


@Component({
  selector: 'app-login-redirect',
  templateUrl: './login-redirect.component.html',
  styleUrls: ['./login-redirect.component.scss']
})
export class LoginRedirectComponent implements OnInit {

  exist: boolean = false;
  isLoginFailed = false;
  userProgress: any;
  config: any;
  adventures: any;
  adventure: any;
  constructor(private route: ActivatedRoute, 
    private router: Router,
    private auth: AuthService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private storeSession: StoreSessionService,
    private configService: ConfigService,
    private gameService: GameService,
    private searchService: SearchService,
    private adventureService: AdventureService,
    private progresService: ProgressService) { }

  ngOnInit(): void {
    const trainer_id = this.route.snapshot.paramMap.get('trainer_id');
    this.checkUser(trainer_id);
  }

  checkUser(trainer_id){
    this.auth.checkTrainer(trainer_id).subscribe(
      response => {
        this.exist = response['user'];
        if(this.exist){
          this.login()
        }
        else{
          this.register()
        }
      },
      err => {
        console.log(err)
      }
    )
  }

  login(){
    const trainer_id = this.route.snapshot.paramMap.get('trainer_id');
    const api_key = this.route.snapshot.paramMap.get('api_key');
    const adventure = this.route.snapshot.paramMap.get('adventure');
    const url = this.route.snapshot.paramMap.get('url').split("-").join("/");
    this.translate.get('LOGIN.TOASTR').subscribe(
      (toastr) => {
        this.auth.loginAPIKEY(trainer_id, api_key, url).subscribe(
          (data: any) => {
            this.auth.saveToken(data.token);
            this.auth.saveUser(data.user);

            this.isLoginFailed = false;
            /*
            // Post session login to server
            if (this.config.sessionTracking) {
              this.postSessionLogin(data);
            }
            */
            this.toastr.success(toastr.SUCCESS);
            this.auth.userEmitChange(this.auth.getUser());
            const playerId = this.auth.getUser()._id;
            this.fetchPlayableAdventures(playerId, adventure);
          },
          (err) => {
            this.isLoginFailed = true;
            let error_msg = this.translate.instant("LOGIN.TOAST.ERROR_MESSAGE");
            this.toastr.error(error_msg, this.translate.instant("LOGIN.TOAST.ERROR"), {
              timeOut: 5000,
              positionClass: 'toast-top-center'
            });
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
        this.isLoginFailed = true;
      }
    );
  }

  register(){
    const email = this.route.snapshot.paramMap.get('email');
    const username = this.route.snapshot.paramMap.get('username');
    const adventure = this.route.snapshot.paramMap.get('adventure');
    const trainer_id = this.route.snapshot.paramMap.get('trainer_id');
    const api_key = this.route.snapshot.paramMap.get('api_key')
    const url = this.route.snapshot.paramMap.get('url').split("-").join("/");
    this.translate.get('LOGIN.TOASTR').subscribe(
      (toastr) => {
        this.auth.registerAPIKEY(email, username, trainer_id, api_key, url).subscribe(
          (data: any) => {
            this.auth.saveToken(data.token);
            this.auth.saveUser(data.user);

            this.isLoginFailed = false;
            /*
            // Post session login to server
            if (this.config.sessionTracking) {
              this.postSessionLogin(data);
            }
            */
            this.toastr.success(toastr.SUCCESS);
            this.auth.userEmitChange(this.auth.getUser());
            const playerId = this.auth.getUser()._id;
            this.fetchPlayableAdventures(playerId, adventure);
          },
          (err) => {
            this.isLoginFailed = true;
            let error_msg = this.translate.instant("LOGIN.TOAST.ERROR_MESSAGE");
            this.toastr.error(error_msg, this.translate.instant("LOGIN.TOAST.ERROR"), {
              timeOut: 5000,
              positionClass: 'toast-top-center'
            });
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
        this.isLoginFailed = true;
      }
    );
  }

  private postSessionLogin(data: any) {
    if (this.auth.getUser().role == 'player') {
      let sessionLog = {
        userId: data.user._id,
        username: data.user.username || data.user.email,
        state: 'login',
        localTimeStamp: Date.now(),
      };
      this.storeSession.postSessionLog(sessionLog);
    }
  }

  async play(adventure: any) {
    await this.gameService.init(adventure).then(() => {
      this.searchService.init();
      this.router.navigate(['game']);
    });
  }

  private fetchPlayableAdventures(playerId: any, adventureId: any) {
    this.adventureService.getPlayerAdventures(playerId).subscribe(
      (res) => {
        this.adventures = res;
        if (this.auth.getRole() == 'player') {
          let user = this.auth.getUser();
          this.progresService.getUserProgress(user._id).subscribe(
            (res) => {
              this.userProgress = res;
              this.validateProgress();
            },
            (err) => {
            }
          );
        }
        for(let i = 0; i<this.adventures.length; i++){
          if(this.adventures[i]._id === adventureId){
            this.adventure = this.adventures[i];
            this.play(this.adventure);
            break;
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  validateProgress() {
    this.userProgress.forEach((progress) => {
      let foundIdx = this.adventures.findIndex(
        (adv) => adv._id == progress.adventure
      );
      if (foundIdx >= 0 && this.adventures[foundIdx]) {
        this.adventures[foundIdx].progress = progress;
      }
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

}