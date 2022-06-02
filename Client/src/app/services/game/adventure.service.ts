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
  getAdventure(adventureId): Observable<any> {
    return this.http.get(this.uri+'/'+adventureId);
  }
  //Valentina
  getAdventuresByUser(userId): Observable<any> {
    return this.http.get(this.uri+'/byUser/'+userId);
  }
  getAdventuresByUserCollaboration(userId: string): Observable<any> {
    return this.http.get(this.uri +'/byUserCollaboration/'+userId)
  }
  //Se obtienen los estudios filtrados según privacidad
  getAdventuresByUserByPrivacy(params: any): Observable<any> {
    return this.http.get(this.uri +'/byUserbyPrivacy/'+params.user+'/'+params.privacy)
  }
  getAdventuresByUserByType(params: any): Observable<any> {
    return this.http.get(this.uri +'/byUserbyType/'+params.user+'/'+params.type)
  }

  getPlayerAdventures(playerId): Observable<any> {
    return this.http.get(this.uri + '/player/' + playerId);
  }

  postAdventure(adventure): Observable<any> {
    return this.http.post(this.uri, adventure,{ headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  cloneAdventure(adventure, user): Observable<any> {
    return this.http.post(this.uri+'/clone/'+adventure, {user_id:user},{ headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  createAdventure(adventure): Observable<any> {
    return this.http.post(this.uri +'/new', adventure)
  }

  editCollaboratorAdventure(adventureId: string, collaborators: any): Observable<any> {
    let reqBody = {collaborators: collaborators}
    return this.http.put(this.uri+'/editCollaborator/'+adventureId, reqBody, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
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

  deleteAdventure(adventure): Observable<any> {
    return this.http.delete(this.uri + '/' + adventure._id);
  }

  getAssistant(adventureId: string){
    return this.http.get(this.uri+'/'+adventureId+'/assistant');
  }
}
