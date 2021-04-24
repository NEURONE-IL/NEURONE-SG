import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register-card',
  templateUrl: './register-card.component.html',
  styleUrls: ['./register-card.component.scss'],
})
export class RegisterCardComponent implements OnInit {
  registerForm: FormGroup;
  isRegisterFailed = false;
  @Output()
  switchToLogin = new EventEmitter<boolean>();
  roles: any;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private auth: AuthService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.roles = [
      {
        value: 'player',
        display: 'REGISTER.ROLE_PLAYER',
      },
      {
        value: 'creator',
        display: 'REGISTER.ROLE_CREATOR',
      },
      {
        value: 'admin',
        display: 'REGISTER.ROLE_ADMIN',
      },
    ];
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: [this.roles[0].value, Validators.required],
    });
    if (this.router.url === '/login/confirmedOK') {
      console.log('confirmed');
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const registerBody = {
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      };
      const role = this.registerForm.value.role;
      this.auth.register(registerBody, role).subscribe(
        (data) => {
          this.isRegisterFailed = false;
          this.translate.get('REGISTER.TOASTR').subscribe((res) => {
            this.toastr.success(res.SUCCESS);
          });
          this.toggleLogin();
        },
        (err) => {
          this.translate.get('REGISTER.TOASTR').subscribe((res) => {
            this.toastr.error(res.FAILURE);
          });
          this.isRegisterFailed = true;
        }
      );
    } else {
      this.translate.get('REGISTER.TOASTR').subscribe((res) => {
        this.toastr.info(res.INVALID_FORM);
      });
    }
  }

  toggleLogin() {
    this.switchToLogin.emit(true);
  }
}
