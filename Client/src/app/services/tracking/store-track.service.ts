import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoreTrackService {

  mouseClickUri = environment.apiUrl + '/mouseClick';
  mouseCoordinateUri = environment.apiUrl + '/mouseCoordinate';
  scrollUri = environment.apiUrl + '/scroll';
  keyStrokeUri = environment.apiUrl + '/keystroke';
  eventUri = environment.apiUrl + '/event';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Save mouse clicks
  postMouseClick(data) {
      this.http.post(this.mouseClickUri, data)
      .subscribe((resp: any) => {
        },
        (error) => {
          console.log(error);
        }
        );
  }


  // Save mouse coordinates
  postMouseCoordinates(data) {
      this.http.post(this.mouseCoordinateUri, data)
      .subscribe((resp: any) => {
        },
        (error) => {
          console.log(error);
        }
        );
  }

  // Save scrolls
  postScroll(data) {
      this.http.post(this.scrollUri, data)
      .subscribe((resp: any) => {
        },
        (error) => {
          console.log(error);
        }
        );
  }

  // Save keystrokes
  postKeyStroke(data) {
      this.http.post(this.keyStrokeUri, data)
      .subscribe((resp: any) => {
        },
        (error) => {
          console.log(error);
        }
        );
  }

  // Save events
  postEvent(data){
    if(this.authService.loggedIn){
      data.userId = this.authService.getUser()._id;
      this.http.post(this.eventUri, data)
      .subscribe((resp: any) => {
        },
        (error) => {
          console.log(error);
        }
        );
      }    
  }

}