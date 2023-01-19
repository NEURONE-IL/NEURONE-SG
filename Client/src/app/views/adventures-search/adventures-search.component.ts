import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdventuresSearchResultsComponent } from 'src/app/components/adventures-search-results/adventures-search-results.component';

@Component({
  selector: 'app-adventures-search',
  templateUrl: './adventures-search.component.html',
  styleUrls: ['./adventures-search.component.scss']
})
export class AdventuresSearchComponent implements OnInit {
  name: string;
  search : string = "";
  resultsComponent: AdventuresSearchResultsComponent;

  constructor(
    private router: Router) { }

  ngOnInit(): void {
  }

  async searchAdventures(query: string){

    this.router.navigate(['adventures-search/results/'+query]);

    if (this.name === 'results'){
      if(query === '' || query === null )
        query = 'all'
      this.resultsComponent.getPublicAdventures(query);
    }
    this.search = "";
  }
  onActivate(componentReference) {
    this.name = componentReference.route.url.value[0].path;
    if (this.name === 'results'){
      this.resultsComponent = componentReference;
    }
 }
}
