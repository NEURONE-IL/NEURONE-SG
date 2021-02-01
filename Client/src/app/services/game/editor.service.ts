import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { AdventureService } from './adventure.service';
import { nanoid } from 'nanoid';

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  adventure: any;

  currentNode: any;

  loading = true;

  updating = false;

  private refreshGraphSubject = new Subject<any>();

  constructor(private adventureService: AdventureService,
              public router: Router) {
  }

  init(adventure) {

    // this.adventureService.getAdventures().subscribe((adventures) => {
    //   this.adventure = adventures[1];

    //   this.currentNode = this.adventure.nodes.find(node => node.type="initial");
    //   this.loading = false;
    // },
    // (err) => {
    //   console.log("couldn't load adventures");
    // });

    this.adventure = adventure;
    this.currentNode = this.adventure.nodes.find(node => node.type="initial");
    this.loading = false;
    console.log('editor service init complete');
  }

  reset() {
    this.adventure = null;
    this.currentNode = null;
    this.loading = true;
  }

  goTo(targetNodeId) {
    this.currentNode = this.adventure.nodes.find(node => node.id==targetNodeId);
    console.log(this.currentNode);
  }

  get currentNodeLinks() {
    return this.adventure.links.filter(link => link.source==this.currentNode.id);
  }

  get nodes() {
    return this.adventure.nodes;
  }

  get links() {
    return this.adventure.links;
  }

  get name() {
    return this.adventure.name;
  }

  get description() {
    return this.adventure.description;
  }

  get otherNodes() {
    return this.adventure.nodes.filter(
      (node) => this.currentNode != node
    );
  }

  updateNode(newNode) {
    this.nodes.forEach((node, index) => {
      if(node.id==this.currentNode.id) {
        // Workaround to keep challenges for now
        if ('challenge' in this.nodes[index].data) {
          newNode.challenge = this.nodes[index].challenge;
        }
        console.log('newNode', newNode);
        this.nodes[index] = newNode;
      }
    });
    this.links.forEach((link, index) => {
      if(link.source==this.currentNode.id) {
        link.source = newNode.id;
      }
      if(link.target==this.currentNode.id) {
        link.target = newNode.id;
      }
    });
  }

  addLink(newLink) {
    if ('activators' in newLink) {
      if (newLink.activators.length==0) {
        delete newLink.activators;
      }
    }
    this.links.push(newLink);
    this.refreshGraphSubject.next(true);
  }

  addNode(newNode) {
    newNode.id = nanoid(12);
    this.nodes.push(newNode);
    this.refreshGraphSubject.next(true);
  }

  updateMeta(newMeta) {
    this.adventure.name = newMeta.name;
    this.adventure.description = newMeta.description;
  }

  updateChallenge(newChallenge) {
    this.currentNode.challenge = newChallenge;
    this.refreshGraphSubject.next(true);
  }

  getRefreshRequest(): Observable<any> {
    return this.refreshGraphSubject.asObservable();
  }

  updateAdventure() {
    this.adventureService.updateAdventure(this.adventure).subscribe((res) => {
      this.updating = false;
      this.refreshGraphSubject.next(true);
    },
    (err) => {
      console.log(err);
    });
  }
}
