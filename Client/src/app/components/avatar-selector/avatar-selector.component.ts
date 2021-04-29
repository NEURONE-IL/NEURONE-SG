import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss'],
})
export class AvatarSelectorComponent implements OnInit {
  loading = true;
  selectedAvatar: any;
  avatars: any;
  avatarsPath = environment.avatarsPath;

  errors = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auth: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<AvatarSelectorComponent>
  ) {
    let user = this.auth.getUser();
    if (user.avatar_img) {
      this.selectedAvatar = user.avatar_img;
      console.log("aaa", this.selectedAvatar);
    }
    this.avatars = [
      {
        name: '01',
        filename: "01.png",
        path: this.avatarsPath + '01.png',
      },
      {
        name: '02',
        filename: "02.png",
        path: this.avatarsPath + '02.png',
      },
      {
        name: '03',
        filename: "03.png",
        path: this.avatarsPath + '03.png',
      },
      {
        name: '04',
        filename: "04.png",
        path: this.avatarsPath + '04.png',
      },
      {
        name: '05',
        filename: "05.png",
        path: this.avatarsPath + '05.png',
      },
      {
        name: '06',
        filename: "06.png",
        path: this.avatarsPath + '06.png',
      },
      {
        name: '07',
        filename: "07.png",
        path: this.avatarsPath + '07.png',
      },
      {
        name: '08',
        filename: "08.png",
        path: this.avatarsPath + '08.png',
      },
      {
        name: '09',
        filename: "09.png",
        path: this.avatarsPath + '09.png',
      },
      {
        name: '10',
        filename: "10.png",
        path: this.avatarsPath + '10.png',
      },
    ];
  }

  ngOnInit(): void {}

  updateAvatar() {
    this.dialogRef.close({ avatar: this.selectedAvatar });
  }
}
