import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss'],
})
export class LoginRegisterComponent implements OnInit {

  register = false;

  constructor() {}

  ngOnInit(): void {}

  toggleRegister() {
    this.register = true;
  }

  toggleLogin() {
    this.register = false;
  }
}
