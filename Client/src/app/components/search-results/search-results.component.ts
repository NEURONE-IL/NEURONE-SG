import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SearchService } from 'src/app/services/search/search.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  fetching = true;
  documents: any;
  query: string;
  coreRoot = environment.coreRoot;

  constructor(private search: SearchService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.query = params.get('query');
      this.search.getDocuments(this.query, null, null).subscribe(
        (res) => {
          console.log(res);
          this.documents = res;
          this.fetching = false;
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }
}
