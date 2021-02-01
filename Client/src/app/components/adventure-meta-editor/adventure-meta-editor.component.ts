import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditorService } from 'src/app/services/game/editor.service';

@Component({
  selector: 'app-adventure-meta-editor',
  templateUrl: './adventure-meta-editor.component.html',
  styleUrls: ['./adventure-meta-editor.component.scss'],
})
export class AdventureMetaEditorComponent implements OnInit {
  adventure: any;
  adventureSubscription: Subscription;

  metaForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public editorService: EditorService
  ) {
    this.adventureSubscription = this.editorService.adventureEmitter.subscribe(
      (adventure) => {
        this.adventure = adventure;
      }
    );
  }

  ngOnInit(): void {
    this.metaForm = this.formBuilder.group({
      name: [],
      description: [],
    });
  }

  saveAllChanges() {
    this.editorService.setUpdating(true);
    this.editorService.updateMeta(this.metaForm.value);
    this.editorService.updateAdventure();
  }
}
