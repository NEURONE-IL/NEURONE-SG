import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-link-dialog',
  templateUrl: 'new-link-dialog.html',
  styleUrls: ['dialogs.scss'],
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
        viewValue: 'LINKS_DIALOG.ACTIVATOR_TYPES.CORRECT_ANSWER',
      },
      {
        value: 'wrong_answer',
        viewValue: 'LINKS_DIALOG.ACTIVATOR_TYPES.WRONG_ANSWER',
      },
      { value: 'level', viewValue: 'LINKS_DIALOG.ACTIVATOR_TYPES.LEVEL' },
    ];
    this.GMlevels = [
      {
        key: 'principiante_1',
        viewValue: 'Principiante',
      },
      {
        key: 'aprendiz_1',
        viewValue: 'Aprendiz',
      },
      {
        key: 'adepto_1',
        viewValue: 'Adepto',
      },
      {
        key: 'graduado_1',
        viewValue: 'Graduado',
      },
      {
        key: 'experto_1',
        viewValue: 'Experto',
      },
      {
        key: 'maestro_1',
        viewValue: 'Maestro',
      },
      {
        key: 'leyenda_1',
        viewValue: 'Leyenda',
      },
    ];
    this.linkForm = this.formBuilder.group({
      label: [],
      source: [this.node.id],
      target: [],
      activators: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {}

  addNewLink() {
    console.log(this.linkForm.value);
    const newLink = this.linkForm.value;
    this.dialogRef.close({ newLink: newLink });
  }

  get activatorsArray() {
    return this.linkForm.get('activators') as FormArray;
  }

  addActivator() {
    const newActivator = this.formBuilder.group({
      node: '',
      condition: '',
    });

    this.activatorsArray.push(newActivator);
  }
  removeItem() {
    this.activatorsArray.removeAt(this.activatorsArray.length - 1);
  }
  removeActivator(idx) {
    this.activatorsArray.removeAt(idx);
  }

  printActivator(activator) {
    console.log(activator.get('condition'));
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
  get challengeNodes() {
    return this.nodes.filter(node => node.type == 'challenge');
  }
}
