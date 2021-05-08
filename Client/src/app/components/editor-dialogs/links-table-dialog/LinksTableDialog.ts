import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { NewLinkDialogComponent } from '../new-link-dialog/NewLinkDialogComponent';

@Component({
  selector: 'app-links-table-dialog',
  templateUrl: 'links-table-dialog.html',
  styleUrls: ['links-table-dialog.scss'],
})
export class LinksTableDialog implements OnInit {

  nodes: any;
  currentNode: any;
  links: any;
  dataSource: any;
  displayedColumns: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public newLinkDialog: MatDialog,
    public dialogRef: MatDialogRef<LinksTableDialog>,
    private translate: TranslateService
  ) {
    this.links = Object.assign([], data.links);
    this.currentNode = data.node;
    this.nodes = data.nodes;
    this.dataSource = new MatTableDataSource(this.links);
    this.displayedColumns = ['source', 'target', 'label', 'actions'];
  }

  ngOnInit(): void {}

  closeDialogs() {
    if (this.newLinkDialog) this.newLinkDialog.closeAll();
  }

  deleteLink(idx) {
    this.translate.get('WARNINGS').subscribe((res) => {
      if (confirm(res.DELETE_LINK)) {
    this.dataSource.data.splice(idx, 1);
    this.dataSource._updateChangeSubscription();
    console.log(idx);
      }
    });
  }

  addLink(link) {
    this.dataSource.data.push(link);
    this.dataSource._updateChangeSubscription();
  }

  editLink(idx) {
    console.log(idx);
  }

  getNodeLabel(id) {
    try {
      return this.nodes.find(node => node.id==id).label;
    } catch (error) {
      console.log(error);
      return id;
    }
  }

  hideRow(row) {
    if (row.source == this.currentNode.id) {
      return false;
    }
    return true;
  }

  showNewLinkDialog() {
    const linkDialogRef = this.newLinkDialog.open(NewLinkDialogComponent, {
      width: '40rem',
      data: {
        nodes: this.nodes,
        node: this.currentNode,
        targetNodes: this.targetNodes,
      },
    });

    linkDialogRef.afterClosed().subscribe((result) => {
      console.log('closed linkDialog');
      if (result.newLink) {
        console.log('new link: ', result.newLink);
        this.addLink(result.newLink);
      }
    });
  }

  get targetNodes() {
    return this.nodes.filter((node) => this.currentNode != node);
  }

  save() {
    this.dialogRef.close({ links: this.links });
  }

  viewTable() {
    const nodeLinks = this.dataSource.data.filter(link => link.source == this.currentNode.id);
    if(nodeLinks.length > 0) {
      return true;
    }
    return false;
  }

}
