import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search/search.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  documents: any;
  coreRoot = environment.coreRoot;

  constructor(private search: SearchService) { }

  ngOnInit(): void {
    this.search.getDocuments(null, null, null).subscribe((res) => {
      console.log(res);
      this.documents = res;
    },
    (err) =>{
      console.log(err);
    })
  }

}
