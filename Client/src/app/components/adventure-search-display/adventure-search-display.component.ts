import { Component, HostListener, OnInit } from '@angular/core';
import { EditorService } from '../../services/game/editor.service';
import { CanExitGuard } from 'src/app/helpers/guards/can-exit.guard';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-adventure-search-display',
  templateUrl: './adventure-search-display.component.html',
  styleUrls: ['./adventure-search-display.component.scss']
})
export class AdventureSearchDisplayComponent implements OnInit {

  constructor(public editorService: EditorService, 
              private translate: TranslateService, 
              private router: Router, // No sacar !
              private route: ActivatedRoute,
              ) { }


  ngOnInit(): void {
    
  }

}