import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreLinkService {

  visitedLinkUri = environment.apiUrl + '/visitedLink';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Post visited link to server
  postVisitedLink(data) {
    if(this.authService.getUser() && this.authService.getUser().role=='player'){
      data.userId = this.authService.getUser()._id;
      this.http.post(this.visitedLinkUri, data)
      .subscribe((resp: any) => {
        },
        (error) => {
          console.log(error);
        }
        );
    }
  }
}
