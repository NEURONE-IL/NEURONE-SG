import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  //test story
  story: any;
  //formatted story
  storyLinks: any;
  storyNodes: any;

  currentNode: any;
  loading = true;

  constructor() {
    this.init();
  }

  init() {

    this.storyLinks =
    [
      {
        id: 'a',
        source: 'initial',
        target: 'office',
        label: 'enter the building'
      },
      {
        id: 'b',
        source: 'office',
        target: 'homecinema',
        label: 'open the door'
      },
      {
        id: 'c',
        source: 'homecinema',
        target: 'office',
        label: 'go back into the office'
      },
      {
        id: 'd',
        source: 'homecinema',
        target: 'initial',
        label: 'go back outside'
      }
    ]

    this.storyNodes =
    [
      {
        id: 'initial',
        label: 'A',
        type: 'transition',
        data: {
          image:"https://image.freepik.com/free-photo/modern-residential-building_1268-14735.jpg",
          text:"This is a rather boring room, but despite that, you feel the pull of a new adventure!"
        }
      },
      {
        id: 'office',
        label: 'B',
        type: 'transition',
        data: {
          image:"https://image.freepik.com/free-photo/modern-office-space-interior_158595-5206.jpg",
          text:"Cool office, there's another door anyway..."
        }
      },
      {
        id: 'homecinema',
        label: 'C',
        type: 'transition',
        data: {
          image:"https://image.freepik.com/free-vector/realistic-mockup-living-room-with-big-plasma-tv-flat-gray-wall-black-stand_1441-2201.jpg",
          text:"You've entered what seems to be a home cinema. Now that's a nice screen!"
        }
      },
      {
        id: 'end1',
        label: 'D',
        type: 'ending',
        data: {
          image:"https://image.freepik.com/vector-gratis/final-letras-sobre-cortina-roja-cerca-teatro-final-o-final-espectaculo-o-concepto-entretenimiento_1284-41719.jpg",
          text:"wow nice ending!"
        }
      }
    ]
    this.currentNode = this.storyNodes.find(node => node.id="initial");
    this.loading = false;
  }

  goTo(targetNodeId) {
    this.currentNode = this.storyNodes.find(node => node.id==targetNodeId);
    console.log('go to:');
    console.log(this.currentNode);
    console.log(this.getLinks(this.currentNode));
  }

  getLinks(currentNode) {
    return this.storyLinks.filter(link => link.source==currentNode.id);
  }
}
