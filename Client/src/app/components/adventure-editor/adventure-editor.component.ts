import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game/game.service';
import { MatSidenav } from '@angular/material/sidenav';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-adventure-editor',
  templateUrl: './adventure-editor.component.html',
  styleUrls: ['./adventure-editor.component.css']
})
export class AdventureEditorComponent implements OnInit {

  updateGraph: Subject<boolean> = new Subject();
  currentNode: any;
  @ViewChild('sidenav') nodeEditor: MatSidenav;
  nodeForm: FormGroup;
  nodeLinkForm: FormGroup;


  nodeTypes = [
    {value: "initial", viewValue: "Initial"},
    {value: "transition", viewValue: "Transition"},
    {value: "ending", viewValue: "Ending"},
    {value: "question", viewValue: "Question"},
    {value: "evaluate", viewValue: "Evaluate source"}
  ]

  constructor(public gameService: GameService,
              private formBuilder: FormBuilder) { }

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
    this.currentNode = null;
    this.nodeEditor.close();
  }

  openEditor(node: any) {
    this.currentNode = node;
    console.log(node);
    this.nodeEditor.open();
  }

  updateNode() {
    this.gameService.storyNodes.forEach((node, index) => {
      if(node.id==this.currentNode.id) {
        console.log('found the node!');
        this.gameService.storyNodes[index] = this.nodeForm.value;
      }
    });
    this.closeEditor();
    this.refreshGraph();
  }

  refreshGraph() {
    this.updateGraph.next(true);
  }

  getOtherNodes() {
    return this.gameService.storyNodes.filter(node => this.currentNode!=node);
  }

  getLinks() {
    return this.gameService.storyLinks();
  }

  getNode(nodeId) {
    return this.gameService.storyNodes.find(nodeId);
  }

  addLink(sourceNodeId, targetNodeId, label) {
    const link = {
      id: uuid(),
      source: sourceNodeId,
      target: targetNodeId,
      label: label
    }
    this.gameService.storyLinks.push(link);
    this.closeEditor();
    this.refreshGraph();
  }

  generateLinkId() {
    console.log(uuid());
  }
}
