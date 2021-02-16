import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-link-dialog',
  templateUrl: 'new-link-dialog.html',
  styleUrls: ['new-link-dialog.scss'],
})
export class NewLinkDialogComponent {
  linkForm: FormGroup;
  targetNodes: any;
  nodes: any;
  node: any;
  GMlevels: any;

  activatorTypes: any;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewLinkDialogComponent>
  ) {
    this.nodes = data.nodes;
    this.targetNodes = data.targetNodes;
    this.node = data.node;
    this.activatorTypes = [
      {
        value: 'correct_answer',
        viewValue: 'NEW_LINK_DIALOG.ACTIVATOR_TYPES.CORRECT_ANSWER',
      },
      {
        value: 'wrong_answer',
        viewValue: 'NEW_LINK_DIALOG.ACTIVATOR_TYPES.WRONG_ANSWER',
      },
      { value: 'level', viewValue: 'NEW_LINK_DIALOG.ACTIVATOR_TYPES.LEVEL' },
      { value: 'relevant_links', viewValue: 'NEW_LINK_DIALOG.ACTIVATOR_TYPES.RELEVANT_LINKS' }
    ];
    this.GMlevels = [
      {
        value: 'adventure_level_Principiante',
        viewValue: 'Principiante',
      },
      {
        value: 'adventure_level_Aprendiz',
        viewValue: 'Aprendiz',
      },
      {
        value: 'adventure_level_Adepto',
        viewValue: 'Adepto',
      },
      {
        value: 'adventure_level_Graduado',
        viewValue: 'Graduado',
      },
      {
        value: 'adventure_level_Experto',
        viewValue: 'Experto',
      },
      {
        value: 'adventure_level_Maestro',
        viewValue: 'Maestro',
      },
      {
        value: 'adventure_level_Leyenda',
        viewValue: 'Leyenda',
      },
    ];
    this.linkForm = this.formBuilder.group({
      label: ['', [Validators.required]],
      source: [this.node.id],
      target: ['', [Validators.required]],
      activators: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {}

  addNewLink() {
    console.log('linkForm: ', this.linkForm.value)
    const newLink = this.linkForm.value;
    if (newLink.activators.length == 0) {
      delete newLink.activators;
    }
    else {
      newLink.activators.forEach(activator => {
        if (!activator.node) delete activator.node;
        if (!activator.level) delete activator.level;
        if (!activator.links_count) delete activator.links_count;
      });
    }
    this.dialogRef.close({ newLink: newLink });
  }

  get activatorsArray() {
    return this.linkForm.get('activators') as FormArray;
  }

  addActivator() {
    const newActivator = this.formBuilder.group({
      node: undefined,
      condition: '',
      level: undefined,
      links_count: undefined
    });

    this.activatorsArray.push(newActivator);
  }
  removeItem() {
    this.activatorsArray.removeAt(this.activatorsArray.length - 1);
  }
  removeActivator(idx) {
    this.activatorsArray.removeAt(idx);
  }

  getActivatorCondition(activator) {
    return activator.get('condition').value;
  }

  activatorNeedsNode(activator) {
    if (
      activator.get('condition').value == 'wrong_answer' ||
      activator.get('condition').value == 'correct_answer'
    ) {
      return true;
    }
    return false;
  }

  activatorNeedsLevel(activator) {
    if (activator.get('condition').value == 'level') {
      return true;
    }
    return false;
  }

  activatorNeedsLinksValue(activator) {
    if (activator.get('condition').value == 'relevant_links') {
      return true;
    }
    return false;
  }

  get challengeNodes() {
    return this.nodes.filter(node => node.type == 'challenge');
  }
}
