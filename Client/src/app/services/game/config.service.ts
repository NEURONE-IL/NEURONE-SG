import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  uri = environment.apiUrl + '/config';

  constructor(protected http: HttpClient) {}

  getConfig(): Observable<any> {
    return this.http.get(this.uri);
  }

  updateConfig(updatedConfig): Observable<any> {
    const id = updatedConfig._id;
    delete updatedConfig._id;
    return this.http.put(this.uri + '/' + id, updatedConfig);
  }
}
