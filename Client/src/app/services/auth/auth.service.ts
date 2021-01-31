import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

const AUTH_API = environment.apiUrl + '/auth';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new Subject<any>();
  userEmitter = this.user.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + '/login', {
      email: credentials.email,
      password: credentials.password
    }, httpOptions);
  }

  register(user): Observable<any> {
    return this.http.post(AUTH_API + '/register', {
      username: user.username,
      email: user.email,
      password: user.password
    }, httpOptions);
  }

  userEmitChange(usr: any) {
    this.user.next(usr);
  }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }

  public getRole(): any {
    return JSON.parse(sessionStorage.getItem(USER_KEY)).role;
  }
}
