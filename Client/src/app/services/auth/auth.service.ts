import { Injectable, resolveForwardRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StoreSessionService } from '../tracking/store-session.service';
import { ConfigService } from '../game/config.service';

const AUTH_API = environment.apiUrl + '/auth';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new Subject<any>();
  userEmitter = this.user.asObservable();

  constructor(
    private http: HttpClient,
    private storeSession: StoreSessionService,
    private configService: ConfigService
  ) {}

  login(credentials): Observable<any> {
    return this.http.post(
      AUTH_API + '/login',
      {
        email: credentials.email,
        password: credentials.password,
      },
      httpOptions
    );
  }

  register(user, role): Observable<any> {
    let url = AUTH_API + '/register';
    if (role == 'creator') {
      url = url + '/creator';
    }
    if (role == 'admin') {
      url = url + '/admin';
    }
    return this.http.post(
      url,
      {
        username: user.username,
        email: user.email,
        password: user.password,
      },
      httpOptions
    );
  }

  userEmitChange(usr: any) {
    this.user.next(usr);
  }

  async signOut(): Promise<void> {
    await this.storeSessionLogout();
    window.sessionStorage.clear();
  }

  private async storeSessionLogout() {
    let config: any = await this.fetchConfig();
    if (config.sessionTracking) {
      if (this.getUser().role == 'player') {
        let sessionLog = {
          userId: this.getUser()._id,
          username: this.getUser().username || this.getUser().email,
          state: 'logout',
          localTimeStamp: Date.now(),
        };
        this.storeSession.postSessionLog(sessionLog);
      }
    }
  }

  updateAvatarImage(avatarImg) {
    const userId = this.getUser()._id;
    return this.http.put(AUTH_API + '/' + userId + '/avatar', { avatar_img: avatarImg });
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

  updateStorageAvatar(avatarImg): void {
    let user = JSON.parse(window.sessionStorage.getItem(USER_KEY));
    user.avatar_img = avatarImg;
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  }

  public getRole(): any {
    return JSON.parse(sessionStorage.getItem(USER_KEY)).role;
  }

  async fetchConfig() {
    let config: any;
    await this.configService
      .getConfig()
      .toPromise()
      .then((res) => {
        config = res;
      })
      .catch((err) => {
        console.log(err);
      });
    return config;
  }
}
