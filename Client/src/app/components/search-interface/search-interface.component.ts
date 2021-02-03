import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-interface',
  templateUrl: './search-interface.component.html',
  styleUrls: ['./search-interface.component.scss']
})

export class SearchInterfaceComponent implements OnInit {

  query: string;
  locale: string;
  task: string;
  domain: string;
  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  search(){
    if(this.query){
      this.router.navigate(['game/results/' + this.query])
    }
    else {
      console.log('search: ' + this.query);
    }
  }

}
