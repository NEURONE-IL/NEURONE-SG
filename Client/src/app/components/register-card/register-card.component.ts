import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
    private auth: AuthService
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
    const registerBody = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };
    const role = this.registerForm.value.role;
    this.auth.register(registerBody, role).subscribe(
      (data) => {
        this.isRegisterFailed = false;
        this.reloadPage();
      },
      (err) => {
        this.isRegisterFailed = true;
      }
    );
  }

  toggleLogin() {
    this.switchToLogin.emit(true);
  }

  reloadPage(): void {
    window.location.reload();
  }
}
