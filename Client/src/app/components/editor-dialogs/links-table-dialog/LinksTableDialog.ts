import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
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

  // Closes all dialogs
  closeDialogs() {
    if (this.newLinkDialog) this.newLinkDialog.closeAll();
  }

  // Deletes a link given it's index
  deleteLink(idx) {
    this.translate.get('WARNINGS').subscribe((res) => {
      if (confirm(res.DELETE_LINK)) {
        this.dataSource.data.splice(idx, 1);
        this.dataSource._updateChangeSubscription();
        console.log(idx);
      }
    });
  }

  // Adds a new link
  addLink(link) {
    this.dataSource.data.push(link);
    this.dataSource._updateChangeSubscription();
  }

  // Edits a link given it's new data and index
  editLink(updatedLink, idx) {
    this.dataSource.data[idx] = updatedLink;
    this.dataSource._updateChangeSubscription();
  }

  // Gets a node label by id
  getNodeLabel(id) {
    try {
      return this.nodes.find((node) => node.id == id).label;
    } catch (error) {
      console.log(error);
      return id;
    }
  }

  // Hides a row if it's not the current node
  hideRow(row) {
    if (row.source == this.currentNode.id) {
      return false;
    }
    return true;
  }

  // Shows the link creation dialog
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

  // Shows the link editing dialog
  showEditLinkDialog(link, idx) {
    const linkDialogRef = this.newLinkDialog.open(NewLinkDialogComponent, {
      width: '40rem',
      data: {
        nodes: this.nodes,
        node: this.currentNode,
        targetNodes: this.targetNodes,
        link: link,
      },
    });

    linkDialogRef.afterClosed().subscribe((result) => {
      console.log('closed linkDialog');
      if (result.newLink) {
        console.log('updated link: ', result.newLink);
        this.editLink(result.newLink, idx);
      }
    });
  }

  // Gets all possible targets from the current node
  get targetNodes() {
    return this.nodes.filter((node) => this.currentNode != node);
  }

  // Closes the dialog and transmits the updated links to the parent component
  save() {
    this.dialogRef.close({ links: this.links });
  }

  // Checks if the current node has links, if it does it shows the links table.
  viewTable() {
    const nodeLinks = this.dataSource.data.filter(
      (link) => link.source == this.currentNode.id
    );
    if (nodeLinks.length > 0) {
      return true;
    }
    return false;
  }
}
