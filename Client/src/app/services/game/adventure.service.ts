import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdventureService {

  uri = environment.apiUrl + '/adventure';

  constructor(protected http: HttpClient) { }

  getAdventures(): Observable<any> {
    return this.http.get(this.uri);
  }

  postAdventure(adventure): Observable<any> {
    return this.http.post(this.uri, adventure);
  }

  updateAdventure(adventure): Observable<any> {
    const id = adventure._id;
    const body = { ...adventure };
    delete body._id;
    body.nodes.forEach(node => {
      delete node.data.color;
      delete node.dimension;
      delete node.meta;
      delete node.position;
      delete node.transform;
      delete node._id;
    });
    body.links.forEach((link, index) => {
      delete link.id;
      delete link._id
      if (link.activators) {
        body.links[index].activators.forEach(activator => {
          delete activator._id;
        });
      }
    });
    console.log(adventure);
    return this.http.put(this.uri + '/' + id, body);
  }
}
