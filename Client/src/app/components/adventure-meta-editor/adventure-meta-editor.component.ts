import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EditorService } from 'src/app/services/game/editor.service';

@Component({
  selector: 'app-adventure-meta-editor',
  templateUrl: './adventure-meta-editor.component.html',
  styleUrls: ['./adventure-meta-editor.component.scss']
})
export class AdventureMetaEditorComponent implements OnInit {

  metaForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              public editorService: EditorService) { }

  ngOnInit(): void {
    this.metaForm = this.formBuilder.group({
      name: [],
      description: [],
    });
  }

  saveAllChanges() {
    this.editorService.updating = true;
    this.editorService.updateMeta(this.metaForm.value);
    this.editorService.updateAdventure();
  }

}
