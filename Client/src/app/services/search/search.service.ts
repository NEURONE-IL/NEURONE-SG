import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  uri = environment.coreUrl;

  // Search interface enabled/disabled
  searchEnabled: boolean;
  searchEnabledSubject = new ReplaySubject<boolean>(1);
  searchEnabledEmitter = this.searchEnabledSubject.asObservable();

  constructor(protected http: HttpClient) {}

  init() {
    this.reset();
  }

  reset() {
    this.setSearch(true);
  }

  fetchResults(query, locale, adventure, node) {
    let body: any = {};
    body.query = query;
    if (adventure) {
      body.domain = adventure._id;
    }
    if (node) {
      body.task = node.id;
    }
    if (locale) {
      body.locale = locale;
    }
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'text/plain');
    return this.http.post(this.uri + '/document/search', body, {
      headers: header,
    });
  }

  upload(resource) {
    let cleanResource = Object.assign(new Object(), resource);
    delete cleanResource.checked;
    cleanResource.domain = cleanResource.domain.split();
    cleanResource.task = cleanResource.task.split();
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'text/plain');
    return this.http.post(this.uri + '/document/load', cleanResource, {
      headers: header,
    });
  }

  delete(resource) {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'text/plain');
    return this.http.post(this.uri + '/document/delete', resource, {
      headers: header,
    });
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
