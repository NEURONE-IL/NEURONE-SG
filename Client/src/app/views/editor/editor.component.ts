import { Component, HostListener, OnInit } from '@angular/core';
import { EditorService } from '../../services/game/editor.service';
import { CanExitGuard } from 'src/app/helpers/guards/can-exit.guard';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, CanExitGuard {

  constructor(public editorService: EditorService, private translate: TranslateService) { }

  exitMessage: string;

  ngOnInit(): void {
    this.translate.get("EXIT_WARNINGS").subscribe(res => {
      this.exitMessage = res.EDITOR;
    });
  }

  saveAllFromParent() {
    console.log('save all from parent');
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return false;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
        $event.returnValue = this.exitMessage;
    }
  }

}
