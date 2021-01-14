import { Component, OnInit } from '@angular/core';
import { EditorService } from '../../services/game/editor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  constructor(public editorService: EditorService) { }

  ngOnInit(): void {
  }

  saveAllFromParent() {
    console.log('save all from parent');
  }

}
