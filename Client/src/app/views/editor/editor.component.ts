import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';
import { EditorService } from '../../services/game/editor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  constructor(public editorService: EditorService) { }

  ngOnInit(): void {
  }

  saveAllFromParent() {
    console.log('save all from parent');
  }

}
