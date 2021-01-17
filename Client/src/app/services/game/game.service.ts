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
  challengePending = false;
  activators = [];

  constructor(public adventureService: AdventureService) {
    this.init();
  }

  init() {

    this.adventureService.getAdventures().subscribe((adventures) => {
      console.log(adventures[1]);
      this.adventure = adventures[1];
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
    this.loading = true;
    this.currentNode = this.nodes.find(node => node.id==targetNodeId);
    console.log(this.currentNode);
    if(this.currentNode.type=='challenge') {
      this.challengePending = true;
    }
    this.loading = false;
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
    let currentLinks = this.links.filter(link => link.source==this.currentNode.id);
    for (let i = currentLinks.length - 1; i >= 0; i--) {
      if('activators' in currentLinks[i]) {
        console.log('activators found!');
        if (!currentLinks[i].activators.some(r=> this.activators.includes(r))) {
          currentLinks.splice(i, 1);
        }
      }
    }
    console.log(currentLinks);
    return currentLinks;
  }

  findOne = function (haystack, arr) {
    return arr.some(function (v) {
        return haystack.indexOf(v) >= 0;
    });
  };

  get currentChallenge() {
    return this.currentNode.challenge;
  }
}
