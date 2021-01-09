import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchEnabled = false;

  constructor() { }

  toggleSearch() {
    this.searchEnabled = !this.searchEnabled;
  }

}
