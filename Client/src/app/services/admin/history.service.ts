import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  uri = environment.apiUrl + '/history/';
  constructor(protected http: HttpClient) { 
  }
  getHistoryByUser(user_id: string): Observable<any>{
    return this.http.get(this.uri +'byUser/'+user_id);
  }

  getHistoryByUserByType(user_id: string, type: string): Observable<any>{
    return this.http.get(this.uri +'byUserByType/'+user_id+'/'+type);
  }

  getHistoryByAdventure(adventure_id: string): Observable<any>{
    return this.http.get(this.uri +'byAdventure/'+adventure_id);
  }

  getHistoryByAdventureByType(adventure_id: string, type: string): Observable<any>{
    return this.http.get(this.uri +'byAdventureByType/'+adventure_id+'/'+type);
  }
}
