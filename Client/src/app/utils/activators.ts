import { _MatTabLinkBase } from "@angular/material/tabs";

export default class ActivatorsUtils {


  static checkActivators(links, activators) {
    for (let i = links.length - 1; i >= 0; i--) {
      if(links[i].activators) {
        const found = activators.some(r=> this.includesActivator(links[i].activators, r))
        if(!found) {
          links.splice(i, 1);
        }
      }
    }
    return links;
  }

  private static includesActivator(array, activator) {
    let found = false
    array.forEach(element => {
      if((element.id == activator.id) && (element.condition == activator.condition)) {
        console.log('encontrado!');
        found = true;
      }
    });
    return found;
  }

}
