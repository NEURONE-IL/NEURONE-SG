import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  uri = environment.apiUrl + '/progress';

  constructor(protected http: HttpClient) { }

  getUserProgress(userId): Observable<any> {
    return this.http.get(this.uri + '/user/' + userId);
  }

  postProgress(progress): Observable<any> {
    return this.http.post(this.uri, progress);
  }
}
