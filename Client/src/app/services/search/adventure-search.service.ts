import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdventureSearchService {

  uri = environment.apiUrl + '/adventureSearch/';
  
  constructor(protected http: HttpClient) { }

  searchAdventures(user_id: string, query: string, page: number): Observable<any>{
    return this.http.get(this.uri +'search/'+user_id+'/'+query+'/'+page);
  }
}
