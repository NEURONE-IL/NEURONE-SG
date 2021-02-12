import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GamificationService {

  uri = environment.apiUrl + '/';

  constructor(protected http: HttpClient) { }

  gamificationStatus(): Observable<any> {
    return this.http.get(this.uri+'gamification/isGamified');
  }

  gamify(): Observable<any> {
    return this.http.get(this.uri+'gamification/gamify');
  }

  gamifyDependent(): Observable<any> {
    return this.http.get(this.uri+'gamification/gamifyDependent');
  }

  userLevel(user_id): Observable<any> {
    return this.http.get(this.uri+'gamification/userLevels/'+user_id );
  }

  userLevelProgress(user_id): Observable<any> {
    return this.http.get(this.uri+'gamification/userLevelProgress/'+user_id );
  }

  userCompletedChallenges(user_id): Observable<any> {
    return this.http.get(this.uri+'gamification/userChallenges/'+user_id );
  }

  userPoints(user_id): Observable<any>{
    return this.http.get(this.uri+'gamification/userPoints/'+user_id );
  }

  userRankings(user_id, type): Observable<any>{
    return this.http.get(this.uri+'gamification/userRankings/'+user_id+'/'+type );
  }
}
