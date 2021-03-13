import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreSessionService {

  sessionLogUri = environment.apiUrl + '/sessionLog';

  constructor(private http: HttpClient) { }

  // Post session data
  postSessionLog(data) {
    this.http.post(this.sessionLogUri, data)
    .subscribe((resp: any) => {
      },
      (error) => {
        console.log(error);
      }
      );
  }
}
