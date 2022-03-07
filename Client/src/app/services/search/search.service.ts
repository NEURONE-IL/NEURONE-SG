import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timeout } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  uri = environment.coreUrl;
  uploadTimeout = environment.coreUploadTimeout;
  fetchTimeout = environment.coreFetchTimeout;

  // Search interface enabled/disabled
  searchEnabled: boolean;
  searchEnabledSubject = new ReplaySubject<boolean>(1);
  searchEnabledEmitter = this.searchEnabledSubject.asObservable();

  // Current page
  currentPage: any;
  currentPageSubject = new ReplaySubject<any>(1);
  currentPageEmitter = this.currentPageSubject.asObservable();

  constructor(protected http: HttpClient) {}

  init() {
    this.reset();
  }

  reset() {
    this.setSearch(true);
    this.setCurrentPage(null);
  }

  fetchResults(query, locale, adventureId, node) {
    let body: any = {};
    body.query = query;
    if (adventureId) {
      body.domain = adventureId;
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
    }).pipe(timeout(this.fetchTimeout));
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
    }).pipe(timeout(this.uploadTimeout));
  }

  delete(resource) {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'text/plain');
    return this.http.post(this.uri + '/document/delete', resource, {
      headers: header,
    }).pipe(timeout(this.fetchTimeout));
  }

  setSearch(value: boolean) {
    this.searchEnabled = value;
    this.searchEnabledEmitChange(this.searchEnabled);
  }

  toggleSearch() {
    if(this.searchEnabled){
      /*Dispatch hideneuronesearch event*/
      var evt = new CustomEvent('hideneuronesearch');
      window.dispatchEvent(evt);
      /*End dispatch hideneuronesearch event*/      
    }else{
      /*Dispatch showneuronesearch event*/
      var evt = new CustomEvent('showneuronesearch');
      window.dispatchEvent(evt);
      /*End dispatch showneuronesearch event*/      
    }
    this.searchEnabled = !this.searchEnabled;
    this.searchEnabledEmitChange(this.searchEnabled);
  }

  searchEnabledEmitChange(searchEnabled: boolean) {
    this.searchEnabledSubject.next(searchEnabled);
  }

  setCurrentPage(currentPage: any) {
    this.currentPage = currentPage;
    this.currentPageEmitChange(this.currentPage);
  }

  currentPageEmitChange(currentPage: any) {
    this.currentPageSubject.next(currentPage);
  }
}
