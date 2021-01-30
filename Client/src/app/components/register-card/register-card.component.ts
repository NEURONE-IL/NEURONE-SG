import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenStorageService } from 'src/app/services/auth/token-storage.service';

@Component({
  selector: 'app-register-card',
  templateUrl: './register-card.component.html',
  styleUrls: ['./register-card.component.scss']
})
export class RegisterCardComponent implements OnInit {

  registerForm: FormGroup;
  roles: string[] = [];
  @Input() toggleRegister: () => void;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    if (this.router.url === '/login/confirmedOK') {
      console.log('confirmed');
    }
  }

  onSubmit() {
    const credentials = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
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
