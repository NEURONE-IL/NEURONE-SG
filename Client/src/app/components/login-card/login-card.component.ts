import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/services/game/config.service';
import { StoreSessionService } from 'src/app/services/tracking/store-session.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.scss'],
})
export class LoginCardComponent implements OnInit {
  loginForm: FormGroup;
  isLoginFailed = false;
  config: any;

  @Output()
  switchToRegister = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    public router: Router,
    private translate: TranslateService,
    private toastr: ToastrService,
    private storeSession: StoreSessionService,
    private configService: ConfigService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    if (this.router.url === '/login/confirmedOK') {
      console.log('confirmed');
    }
  }

  async ngOnInit(): Promise<void> {
    await this.fetchConfig();
  }

  onSubmit() {
    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.translate.get('LOGIN.TOASTR').subscribe(
      (toastr) => {
        this.auth.login(credentials).subscribe(
          (data) => {
            this.auth.saveToken(data.token);
            this.auth.saveUser(data.user);

            this.isLoginFailed = false;

            // Post session login to server
            if (this.config.sessionTracking) {
              this.postSessionLogin(data);
            }

            this.toastr.success(toastr.SUCCESS);
            this.auth.userEmitChange(this.auth.getUser());
            this.router.navigate(['/']);
          },
          (err) => {
            this.isLoginFailed = true;
            if (err.error == 'EMAIL_NOT_FOUND') {
              this.toastr.error(toastr.EMAIL_NOT_FOUND);
            }
            if (err.error == 'INVALID_PASSWORD') {
              this.toastr.error(toastr.INVALID_PASSWORD);
            }
            if (err.error == 'USER_NOT_CONFIRMED') {
              this.toastr.error(toastr.USER_NOT_CONFIRMED);
            }
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

  async fetchConfig() {
    await this.configService
      .getConfig()
      .toPromise()
      .then((config) => {
        this.config = config;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  toggleRegister() {
    this.switchToRegister.emit(true);
  }

  reloadPage(): void {
    window.location.reload();
  }
}
