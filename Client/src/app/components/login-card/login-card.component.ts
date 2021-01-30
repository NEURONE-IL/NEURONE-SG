import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/services/auth/token-storage.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.scss'],
})
export class LoginCardComponent implements OnInit {

  loginForm: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  @Input() toggleRegister: () => void;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    if (this.router.url === '/login/confirmedOK') {
      console.log('confirmed');
    }
  }

  onSubmit() {
    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.authService.login(credentials).subscribe(
      data => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data.user);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}
