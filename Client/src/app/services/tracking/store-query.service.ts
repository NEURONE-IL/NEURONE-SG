import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreQueryService {

  queryUri= environment.apiUrl + '/query';

  constructor(private authService: AuthService, private http: HttpClient) { }

  // Post query
  postQuery(data) {
    if(this.authService.getUser() && this.authService.getUser().role=='player'){
      data.userId = this.authService.getUser()._id;
      data.username = this.authService.getUser().username;
      this.http.post(this.queryUri, data)
      .subscribe((resp: any) => {
        },
        (error) => {
          console.log(error);
        }
        );
    }
  }
}
