import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  uri = environment.apiUrl + '/adminNotification/';
  constructor(protected http: HttpClient) { }

  getNotificationByUser(user_id: string): Observable<any>{
    return this.http.get(this.uri +'byUser/'+user_id);
  }
  seeNotification(notification: any): Observable<any>{
    return this.http.put(this.uri + 'seeNotifications/', notification)
  }
}
