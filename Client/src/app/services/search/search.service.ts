import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  uri = environment.coreUrl;

  // Show/hide search interface
  searchEnabled: boolean;
  searchEnabledSubject = new ReplaySubject<boolean>(1);
  searchEnabledEmitter = this.searchEnabledSubject.asObservable();


  constructor(protected http: HttpClient) { }

  init() {
    this.reset();
  }

  reset() {
    this.setSearch(true);
  }

  getDocuments(query, locale, domain){
    const body = JSON.stringify({query: query});
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'text/plain');
    return this.http.post(this.uri+'/document/search', body, {headers: header});
  }

  setSearch(value: boolean) {
    this.searchEnabled = value;
    this.searchEnabledEmitChange(this.searchEnabled);
  }

  toggleSearch() {
    this.searchEnabled = !this.searchEnabled;
    this.searchEnabledEmitChange(this.searchEnabled);
  }

  searchEnabledEmitChange(searchEnabled: boolean) {
    this.searchEnabledSubject.next(searchEnabled);
  }

}
