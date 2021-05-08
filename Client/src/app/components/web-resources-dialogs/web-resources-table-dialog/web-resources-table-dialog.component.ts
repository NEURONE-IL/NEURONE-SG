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
import { NewWebResourceDialogComponent } from '../new-web-resource-dialog/new-web-resource-dialog.component';

@Component({
  selector: 'app-web-resources-table-dialog',
  templateUrl: './web-resources-table-dialog.component.html',
  styleUrls: ['./web-resources-table-dialog.component.scss'],
})
export class WebResourcesTableDialogComponent implements OnInit {
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
    public dialogRef: MatDialogRef<NewWebResourceDialogComponent>
  ) {
    this.displayedColumns = ['type', 'title', 'url', 'actions'];
    this.adventure = this.data.adventure;
    this.search.fetchResults('*', null, this.adventure._id, null).subscribe(
      (resources) => {
        this.resources = resources;
        this.resources = this.resources.filter((r) => r.type != 'image');
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

  showNewResourceDialog() {
    console.log(this.adventure);
    const resourceDialogRef = this.newResourceDialog.open(
      NewWebResourceDialogComponent,
      {
        width: '40rem',
        data: {
          adventure: this.adventure,
        },
      }
    );

    resourceDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetching = true;
        this.search.fetchResults('*', null, this.adventure._id, null).subscribe(
          (resources) => {
            this.resources = resources;
            this.resources = this.resources.filter((r) => r.type != 'image');
            this.dataSource = new MatTableDataSource(this.resources);
            this.fetching = false;
          },
          (err) => {
            console.log(err);
          }
        );
      }
    });
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
