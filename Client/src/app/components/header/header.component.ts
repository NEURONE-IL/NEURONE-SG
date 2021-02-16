import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  user: any;

  constructor(public router: Router, private auth: AuthService) {
    this.auth.userEmitter.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    this.user = this.auth.getUser();
  }

  goToEditor() {
    this.router.navigate(['editor']);
  }

  goToGame() {
    this.router.navigate(['game']);
  }

  logout() {
    this.auth.signOut();
    this.reloadPage();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  reloadPage(): void {
    window.location.reload();
  }

}
