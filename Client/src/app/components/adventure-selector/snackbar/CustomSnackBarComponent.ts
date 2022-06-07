import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatSnackBar,MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AdventureSelectorComponent } from '../adventure-selector.component';


@Component({
  selector: 'snack-bar-component',
  templateUrl:'./custom-snack-bar.component.html',
  styleUrls: ['./custom-snack-bar.component.scss'],
})
export class CustomSnackBarComponent implements OnInit{
  adventure: any
  confirm: boolean
  @Output() test = new EventEmitter<any>();

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBarRef: MatSnackBarRef<CustomSnackBarComponent>
  ) 
  { 
    this.adventure = data.adventure;
  }

  ngOnInit(): void {
      
  }
    
  accept() {
    this.snackBarRef.dismissWithAction();
 }

  cancel() {
    this.snackBarRef.dismiss();
  }

}