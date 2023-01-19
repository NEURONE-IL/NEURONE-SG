import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  uri = environment.apiUrl + '/invitation/';
  constructor(protected http: HttpClient) { }

  getInvitationByUser(user_id: string): Observable<any>{
    return this.http.get(this.uri +'byUser/'+user_id);
  }
  checkExistingInvitation(user_id: string, adventure_id: string): Observable<any>{
    return this.http.get(this.uri +'checkExist/'+user_id+'/'+adventure_id);
  }
  acceptInvitation(invitation: any, type: string): Observable<any>{
    return this.http.put(this.uri + 'acceptInvitation/'+type, invitation)
  }
  rejectInvitation(invitation: any, type: string): Observable<any>{
    return this.http.put(this.uri + 'rejectInvitation/'+type, invitation)
  }
  requestCollab(invitation: any): Observable<any>{
    return this.http.post(this.uri + 'requestCollaboration/', invitation)
  }
}
