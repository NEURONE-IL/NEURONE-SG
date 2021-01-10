import { Component, OnInit, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { EditorService } from 'src/app/services/game/editor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-adventure-editor',
  templateUrl: './adventure-editor.component.html',
  styleUrls: ['./adventure-editor.component.css']
})
export class AdventureEditorComponent implements OnInit {

  updateGraph: Subject<boolean> = new Subject();
  @ViewChild('sidenav') nodeEditor: MatSidenav;
  nodeForm: FormGroup;
  nodeLinkForm: FormGroup;

  // Subscription for updating graph
  updateSubscription: Subscription;


  nodeTypes = [
    {value: "initial", viewValue: "Initial"},
    {value: "transition", viewValue: "Transition"},
    {value: "ending", viewValue: "Ending"},
    {value: "question", viewValue: "Question"},
    {value: "evaluate", viewValue: "Evaluate source"}
  ]

  constructor(public editorService: EditorService,
              private formBuilder: FormBuilder) {
    // subscribe to home component messages
    this.updateSubscription = this.editorService.getMessage().subscribe(value => {
      if (value) {
        this.updateGraph.next(true);
      }
    });
  }

  ngOnInit(): void {
    this.nodeForm = this.formBuilder.group({
      id: [],
      label: [],
      type: [],
      data: this.formBuilder.group({
        image: [],
        text: []
      })
    });
  }

  closeEditor() {
    this.editorService.currentNode = null;
    this.nodeEditor.close();
  }

  openEditor(node: any) {
    this.editorService.currentNode = node;
    this.nodeEditor.open();
  }

  updateNode() {
    this.editorService.updateNode(this.nodeForm.value);

    this.closeEditor();
    this.refreshGraph();
  }

  refreshGraph() {
    this.updateGraph.next(true);
  }

  getOtherNodes() {
    return this.editorService.adventure.nodes.filter(node => this.editorService.currentNode!=node);
  }

  getLinks() {
    return this.editorService.adventure.links;
  }

  addLink(sourceNodeId, targetNodeId, label) {
    const link = {
      source: sourceNodeId,
      target: targetNodeId,
      label: label
    }
    this.editorService.adventure.links.push(link);
    this.closeEditor();
    this.refreshGraph();
  }
}
