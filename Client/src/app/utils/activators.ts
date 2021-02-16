import { _MatTabLinkBase } from "@angular/material/tabs";
export default class ActivatorsUtils {

  static checkActivators(links, activators) {
    console.log("ACTIVATORSSSSSS: ",activators);
    for (let i = links.length - 1; i >= 0; i--) {
      if(links[i].activators) {
        const found = activators.some(r=> this.includesActivator(links[i].activators, r));
        if(!found) {
          links.splice(i, 1);
        }
      }
    }
    return links;
  }

  private static includesActivator(array, activator) {
    let found = false

    console.log("ACTIVATORS: ", array);
    array.forEach(element => {
      if (activator.condition == "correct_answer" || activator.condition == "wrong_answer") {
        if((element.node == activator.node) && (element.condition == activator.condition)) {
          console.log('encontrado!');
          console.log(element);
          console.log(activator);
          found = true;
        }
      }
      else if (activator.condition == "level") {
        console.log('Level ACTIVATOR!!!');
        if(element.level == activator.level) {
          console.log('encontrado level!');
          console.log(element);
          console.log(activator);
          found = true;
        }
      }
      else if (activator.condition == "relevant_links") {
        if(element.links_count == activator.links_count) {
          console.log('encontrado links_count!')
          console.log(element);
          console.log(activator);
          found = true;
        }
      }
    });
    return found;
  }

}
