import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss'],
})
export class LoginRegisterComponent implements OnInit {
  onRegister = false;

  constructor() {}

  ngOnInit(): void {}

  toggleRegister() {
    this.onRegister = !this.onRegister;
    console.log(this.onRegister);
  };
}
