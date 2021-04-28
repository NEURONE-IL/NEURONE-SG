import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { GamificationService } from 'src/app/services/game/gamification.service';
import Utils from 'src/app/utils/utils';

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
  GMlevels = [];

  activatorTypes: any;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewLinkDialogComponent>,
    private translate: TranslateService,
    private toastr: ToastrService,
    private gmService: GamificationService
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
      {
        value: 'relevant_links',
        viewValue: 'NEW_LINK_DIALOG.ACTIVATOR_TYPES.RELEVANT_LINKS',
      },
    ];
    this.gmService.getAvailableLevels().subscribe(
      (levels) => {
        levels.forEach((level) => {
          this.GMlevels.push({
            value: level.code,
            viewValue: level.name,
          });
        });
      },
      (err) => {
        console.log('error fetching NEURONE-GM levels: ', err);
      }
    );
    this.linkForm = this.formBuilder.group({
      label: ['', [Validators.required]],
      source: [this.node.id],
      target: ['', [Validators.required]],
      activators: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {}

  addNewLink() {
    console.log('linkForm: ', this.linkForm.value);
    Utils.markFormGroupTouched(this.linkForm);
    if (this.linkForm.valid) {
      const newLink = this.linkForm.value;
      if (newLink.activators.length == 0) {
        delete newLink.activators;
      } else {
        newLink.activators.forEach((activator) => {
          if (!activator.node) delete activator.node;
          if (!activator.level) delete activator.level;
          if (!activator.links_count) delete activator.links_count;
        });
      }
      this.dialogRef.close({ newLink: newLink });
    } else {
      this.translate.get('COMMON.TOASTR').subscribe((res) => {
        this.toastr.warning(res.INVALID_FORM);
      });
    }
  }

  get activatorsArray() {
    return this.linkForm.get('activators') as FormArray;
  }

  addActivator() {
    const newActivator = this.formBuilder.group({
      node: [],
      condition: ['', Validators.required],
      level: [],
      links_count: [],
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

  onTypeChange(evt, activatorForm) {
    let activatorCtrls = activatorForm.controls;
    if (evt.value == 'correct_answer' || evt.value == 'wrong_answer') {
      activatorCtrls.node.setValidators([Validators.required]);
      activatorCtrls.links_count.clearValidators();
      activatorCtrls.links_count.setErrors(null);
      activatorCtrls.level.clearValidators();
      activatorCtrls.level.setErrors(null);
    }
    if (evt.value == 'level') {
      activatorCtrls.level.setValidators([Validators.required]);
      activatorCtrls.node.clearValidators();
      activatorCtrls.node.setErrors(null);
      activatorCtrls.links_count.clearValidators();
      activatorCtrls.links_count.setErrors(null);
    }
    if (evt.value == 'relevant_links') {
      activatorCtrls.links_count.setValidators([
        Validators.required,
        Validators.min(1),
      ]);
      activatorCtrls.node.clearValidators();
      activatorCtrls.node.setErrors(null);
      activatorCtrls.level.clearValidators();
      activatorCtrls.level.setErrors(null);
    }
  }

  get challengeNodes() {
    return this.nodes.filter((node) => node.type == 'challenge');
  }
}
