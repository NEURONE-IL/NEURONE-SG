import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  uri = environment.apiUrl + '/answer';

  constructor(protected http: HttpClient) { }

  postAnswer(answer): Observable<any> {
    return this.http.post(this.uri, answer);
  }
}
