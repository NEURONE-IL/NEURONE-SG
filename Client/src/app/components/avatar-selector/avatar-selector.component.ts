import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss'],
})
export class AvatarSelectorComponent implements OnInit {
  loading = true;
  selectedAvatar: any;
  avatars: any;
  avatarsPath = "assets/images/avatars/"

  errors = [];

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<AvatarSelectorComponent>
  ) {
    this.avatars = [
      {
        name: '01',
        path: this.avatarsPath + '01.jpg',
      },
      {
        name: '02',
        path: this.avatarsPath + '02.jpg',
      },
      {
        name: '03',
        path: this.avatarsPath + '03.jpg',
      },
      {
        name: '04',
        path: this.avatarsPath + '04.jpg',
      },
      {
        name: '05',
        path: this.avatarsPath + '05.jpg',
      },
      {
        name: '06',
        path: this.avatarsPath + '06.jpg',
      },
      {
        name: '07',
        path: this.avatarsPath + '07.jpg',
      },
      {
        name: '08',
        path: this.avatarsPath + '08.jpg',
      },
      {
        name: '09',
        path: this.avatarsPath + '09.jpg',
      },
      {
        name: '10',
        path: this.avatarsPath + '10.jpg',
      },
    ];
  }

  ngOnInit(): void {}

  updateAvatar() {
    this.dialogRef.close({ avatar: this.selectedAvatar });
  }
}
