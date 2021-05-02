import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GamificationService {

  uri = environment.apiUrl + '/';
  timeout = environment.gmTimeout

  constructor(protected http: HttpClient) { }

  gamificationStatus(): Observable<any> {
    return this.http.get(this.uri+'gamification/isGamified').pipe(timeout(this.timeout));
  }

  gamify(): Observable<any> {
    return this.http.get(this.uri+'gamification/gamify').pipe(timeout(this.timeout + 5000));
  }

  gamifyDependent(): Observable<any> {
    return this.http.get(this.uri+'gamification/gamifyDependent').pipe(timeout(this.timeout + 5000));
  }

  userLevel(user_id): Observable<any> {
    return this.http.get(this.uri+'gamification/userLevels/'+user_id ).pipe(timeout(this.timeout));
  }

  userLevelProgress(user_id): Observable<any> {
    return this.http.get(this.uri+'gamification/userLevelProgress/'+user_id ).pipe(timeout(this.timeout));
  }

  userCompletedChallenges(user_id): Observable<any> {
    return this.http.get(this.uri+'gamification/userChallenges/'+user_id ).pipe(timeout(this.timeout));
  }

  userPoints(user_id): Observable<any>{
    return this.http.get(this.uri+'gamification/userPoints/'+user_id ).pipe(timeout(this.timeout));
  }

  userRankings(user_id, type): Observable<any>{
    return this.http.get(this.uri+'gamification/userRankings/'+user_id+'/'+type ).pipe(timeout(this.timeout));
  }

  getAvailableLevels(): Observable<any> {
    return this.http.get(this.uri+'gamification/availableLevels/').pipe(timeout(this.timeout));
  }
}
