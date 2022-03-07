import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  closeModal(){
    /*Dispatch closeinstructionsmodal event*/
    var evt = new CustomEvent('closeinstructionsmodal');
    window.dispatchEvent(evt);
    /*End dispatch closeinstructionsmodal event*/
    return true;    
  }

}
