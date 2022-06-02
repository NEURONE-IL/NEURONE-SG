import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { GamificationService } from 'src/app/services/game/gamification.service';
import { environment } from 'src/environments/environment';
import { AdventureService } from 'src/app/services/game/adventure.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AdventureSearchService } from 'src/app/services/search/adventure-search.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';

export interface Paginator {
  totalDocs:number, 
  perPages: number, 
}

@Component({
  selector: 'app-adventures-search-results',
  templateUrl: './adventures-search-results.component.html',
  styleUrls: ['./adventures-search-results.component.scss']
})
export class AdventuresSearchResultsComponent implements OnInit {
  actualQuery: string = "";
  adventures: any[] = [];
  paginator: Paginator = {
    totalDocs:8, 
    perPages: 8, 
  }
  pageEvent: PageEvent;
  adventuresLoading = true;

  apiUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
              private gamificationService: GamificationService,
              private router: Router,
              private route: ActivatedRoute, 
              private adventureSearchService: AdventureSearchService,
              private toastr: ToastrService, 
              private translate: TranslateService, 
  ) { }

  ngOnInit(): void {
    let searchTerm = this.route.snapshot.paramMap.get('term');
    this.getAdventuresResults(searchTerm,1); 
  }
  getAdventuresResults(searchTerm, page){
    this.actualQuery = searchTerm;
    let _user_id = this.authService.getUser()._id
    this.adventureSearchService.searchAdventures(_user_id, searchTerm,page).subscribe(
      response => {
        let adventures: any[] = []
        this.paginator.totalDocs = parseInt(response.totalDocs);
        let docs = response.docs
        docs.forEach(doc => {adventures.push(doc.adventure)})
        this.adventures = adventures;
        this.adventuresLoading = false;
        console.log(this.adventures)
      },
      err => {
        this.adventuresLoading = false;
        this.toastr.error("Ha ocurrido un error al cargar las aventuras", "Error", {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );

}
clickedAdventure(id){
  let link = '/adventures-search/adventure/'+id;
  this.router.navigate([link]);
}

@ViewChild('adventuresPaginator') adventuresPaginator: MatPaginator;
pageTurn(event){
  this.getAdventuresResults(this.actualQuery,event.pageIndex + 1)
}

getPublicAdventures(term: string){
  console.log(term)
  
  this.router.navigate(['adventures-search/results/'+term]);

  if(this.adventuresPaginator !== undefined)
    this.adventuresPaginator.firstPage();
  this.getAdventuresResults(term,1)
  
}

}
