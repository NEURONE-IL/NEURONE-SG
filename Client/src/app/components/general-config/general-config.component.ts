import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/services/game/config.service';

@Component({
  selector: 'app-general-config',
  templateUrl: './general-config.component.html',
  styleUrls: ['./general-config.component.scss'],
})
export class GeneralConfigComponent implements OnInit {
  config: any;
  loading = true;

  touched = false;

  constructor(
    private configService: ConfigService,
    public router: Router,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.touched = false;
    this.configService.getConfig().subscribe(
      (res) => {
        this.config = res;
        this.loading = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updateConfig() {
    this.translate.get("CONFIG.TOASTR").subscribe((msg) => {
      this.configService.updateConfig(this.config).subscribe(
        (res) => {
          this.toastr.success(msg.SUCCESS);
          this.ngOnInit();
        },
        (err) => {
          this.toastr.error(msg.ERROR);
          console.log(err);
        }
      );
    },
    (err) => {
      console.log(err);
    })
  }

  configTouched() {
    this.touched = true;
  }
}
