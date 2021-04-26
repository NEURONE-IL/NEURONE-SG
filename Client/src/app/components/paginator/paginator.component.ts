import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OnChanges } from '@angular/core';

// Paginator component template
// Adapted from: https://stackoverflow.com/questions/55564200/google-style-pagination
// See answer by: Iman

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent implements OnChanges {
  @Input('totalItems') totalItems;
  @Input('pageSize') pageSize;
  @Output('pageChanged') pageChanged = new EventEmitter();
  pages: any[];
  currentPage = 1;
  page: number;

  ngOnChanges() {
    this.currentPage = 1;

    var pagesCount = Math.ceil(this.totalItems / this.pageSize);
    this.pages = [];
    for (var i = 1; i <= pagesCount; i++) this.pages.push(i);
  }

  changePage(page) {
    this.currentPage = page;
    this.pageChanged.emit(page);
  }

  previous() {
    if (this.currentPage == 1) return;

    this.currentPage--;
    this.pageChanged.emit(this.currentPage);
  }

  next() {
    if (this.currentPage == this.pages.length) return;

    this.currentPage++;
    this.pageChanged.emit(this.currentPage);
  }
}
