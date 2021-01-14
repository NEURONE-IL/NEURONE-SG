import { Injectable } from '@angular/core';
import { AdventureService } from '../../services/game/adventure.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  // adventure or escaperoom
  adventure: any;

  // player data
  player: any;

  currentNode: any;
  loading = true;

  constructor(public adventureService: AdventureService) {
    this.init();
  }

  init() {

    this.adventureService.getAdventures().subscribe((adventures) => {
      this.adventure = adventures[0];
      this.player = {
        name: 'Anne',
        level: 'NEURONE novice'
      }

      this.currentNode = this.nodes.find(node => node.type="initial");
      this.loading = false;
    },
    (err) => {
      console.log("couldn't load adventures");
    });
  }

  goTo(targetNodeId) {
    this.currentNode = this.nodes.find(node => node.id==targetNodeId);
    console.log('go to:');
    console.log(this.currentNode);
    console.log(this.currentLinks);
  }

  getLinks(currentNode) {
    return this.links.filter(link => link.source==currentNode.id);
  }

  get links() {
    return this.adventure.links;
  }

  get nodes() {
    return this.adventure.nodes;
  }

  get currentLinks() {
    return this.links.filter(link => link.source==this.currentNode.id);
  }
}
