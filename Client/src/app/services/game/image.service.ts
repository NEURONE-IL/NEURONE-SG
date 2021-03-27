import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  uri = environment.apiUrl + '/image';

  constructor(protected http: HttpClient) { }

  upload(image) {
    let formdata = new FormData();
    formdata.append('file', image);
    return this.http.post(this.uri, formdata);
  }

  // get(imageid) {
  //   return this.http.get(this.uri + '/' + imageid);
  // }
}
