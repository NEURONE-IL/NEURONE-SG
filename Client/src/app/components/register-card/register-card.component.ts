import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register-card',
  templateUrl: './register-card.component.html',
  styleUrls: ['./register-card.component.scss']
})
export class RegisterCardComponent implements OnInit {

  registerForm: FormGroup;
  isRegisterFailed = false;
  @Output()
  switchToLogin = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private auth: AuthService
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
    const registerBody = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };
    this.auth.register(registerBody).subscribe(
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
