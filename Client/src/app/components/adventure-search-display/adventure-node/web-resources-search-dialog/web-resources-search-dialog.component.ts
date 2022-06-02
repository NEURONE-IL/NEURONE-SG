import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-web-resources-search-dialog',
  templateUrl: './web-resources-search-dialog.component.html',
  styleUrls: ['./web-resources-search-dialog.component.scss'],
})
export class WebResourcesSearchDialogComponent implements OnInit {
  adventure: any;
  nodes: any;
  dataSource: any;
  displayedColumns: any;

  fetching = true;
  resources: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private search: SearchService,
    public newResourceDialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {
    this.displayedColumns = ['type', 'title', 'url'];
    this.adventure = this.data.adventure;
    this.search.fetchResults('*', null, this.adventure._id, null).subscribe(
      (resources) => {
        this.resources = resources;
        this.resources = this.resources.filter((r) => r.type != 'image');
        console.log(this.resources)
        this.dataSource = new MatTableDataSource(this.resources);
        this.fetching = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {}

  closeDialogs() {
    if (this.newResourceDialog) this.newResourceDialog.closeAll();
  }

  remove(resource) {
    console.log(resource);
    this.translate.get('WARNINGS').subscribe((res) => {
      if (confirm(res.DELETE_RESOURCE)) {
        this.fetching = true;
        this.translate.get('WEB_RESOURCES_TABLE.REMOVE_RESOURCE').subscribe(
          (msg) => {
            this.search.delete(resource).subscribe(
              (res) => {
                this.toastr.success(msg.OK);
                this.search
                  .fetchResults('*', null, this.adventure._id, null)
                  .subscribe(
                    (resources) => {
                      this.resources = resources;
                      this.resources = this.resources.filter(
                        (r) => r.type != 'image'
                      );
                      this.dataSource = new MatTableDataSource(this.resources);
                      this.fetching = false;
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
              },
              (err) => {
                this.toastr.error(msg.ERROR);
                console.log(err);
              }
            );
          },
          (err) => {}
        );
      }
    });
  }
}
