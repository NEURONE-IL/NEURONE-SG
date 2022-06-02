import { Component, Inject, ɵConsole } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditorService } from 'src/app/services/game/editor.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { SearchService } from 'src/app/services/search/search.service';
import Utils from 'src/app/utils/utils';

@Component({
  selector: 'app-challenge-view',
  templateUrl: 'challenge-view.html',
  styleUrls: ['challenge-view.scss'],
})
export class ChallengeViewComponent {
  challengeForm: FormGroup;
  targetNodes: any;
  types: any;
  documents: any;
  loading = true;
  challengeTypeView: string;
  documentView: any;

  errors = [];

  constructor(
    private formBuilder: FormBuilder,
    public editorService: EditorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ChallengeViewComponent>,
    private search: SearchService
  ) {
    const node = data.node;
    const adventureId = data.adventure;
    console.log('AVENTURA:  ', adventureId);
    this.challengeForm = this.formBuilder.group({
      type: ['', Validators.required],
      question: ['', Validators.required],
      document: [],
      answer: [],
      options: this.formBuilder.array([]),
    });
    this.search.fetchResults('*', null, adventureId, null).subscribe(
      (documents) => {
        this.documents = documents;
        this.documents = this.documents.filter((r) => r.type != 'image');
        console.log(this.documents)
        this.documentView = this.documents.find(doc => doc._id === this.challengeForm.value.document)

        this.loading = false;
      },
      (err) => {
        console.log(err);
      }
    );
    
    this.types = [
      {
        value: 'question',
        viewValue: 'CHALLENGE_DIALOG.TYPES.QUESTION',
      },
      {
        value: 'multiple',
        viewValue: 'CHALLENGE_DIALOG.TYPES.MULTIPLE',
      },
      {
        value: 'bookmark',
        viewValue: 'CHALLENGE_DIALOG.TYPES.BOOKMARK',
      },
    ];

    if (node.challenge) {
      this.challengeForm.get('type').setValue(node.challenge.type);
      this.challengeForm.get('question').setValue(node.challenge.question);
      this.challengeForm.get('document').setValue(node.challenge.document);
      this.challengeForm.get('answer').setValue(node.challenge.answer);
      this.challengeTypeView = this.types.find(type => type.value === node.challenge.type).viewValue

      if (node.challenge.options) {
        node.challenge.options.forEach((option) => {
          const existingOption = this.formBuilder.group({
            value: [option.value, Validators.required],
            correct: [option.correct],
          });
          this.optionsArray.push(existingOption);
        });
      }
      console.log(this.optionsArray.controls);
    }
  }

  ngOnInit(): void {}

  saveChallenge() {
    let challenge = this.challengeForm.value;
    Utils.markFormGroupTouched(this.challengeForm);
    if (challenge.type == 'multiple') {
      delete challenge.answer;
      delete challenge.document;
    }
    if (challenge.type == 'question') {
      delete challenge.options;
      delete challenge.document;
    }
    if (challenge.type == 'bookmark') {
      delete challenge.answer;
      delete challenge.options;
    }
    console.log(this.challengeForm);
    if (this.challengeForm.valid) {
      if (challenge.type == 'multiple' && this.optionsArray.length < 2) {
        this.translate.get('CHALLENGE_DIALOG').subscribe((res) => {
          this.toastr.warning(res.NO_OPTIONS_SELECTED);
        });
      } else {
        this.dialogRef.close({ challenge: challenge });
      }
    } else {
      this.translate.get('COMMON.TOASTR').subscribe((res) => {
        this.toastr.warning(res.INVALID_FORM);
      });
    }
  }

  updateType(type) {
    console.log(type);
    let controls = this.challengeForm.controls;
    let optionsArray = this.challengeForm.get('options') as FormArray;
    if (type == 'question') {
      controls.answer.setValidators([Validators.required]);
      controls.document.clearValidators();
      controls.document.setErrors(null);
      optionsArray.clear();
    }
    if (type == 'multiple') {
      controls.answer.clearValidators();
      controls.answer.setErrors(null);
      controls.document.clearValidators();
      controls.document.setErrors(null);
    }
    if (type == 'bookmark') {
      controls.document.setValidators([Validators.required]);
      controls.answer.clearValidators();
      controls.answer.setErrors(null);
      optionsArray.clear();
    }
  }

  addOption() {
    this.translate
      .get('CHALLENGE_DIALOG.NEW_OPTION')
      .subscribe((res: string) => {
        const newOption = this.formBuilder.group({
          value: res,
          correct: false,
        });
        if (this.optionsArray.length == 5) {
          this.translate
            .get('CHALLENGE_DIALOG.OPTION_MAXLIMIT_MSG')
            .subscribe((msg: string) => {
              this.toastr.warning(msg);
            });
        } else {
          this.optionsArray.push(newOption);
        }
      });
  }

  removeOption(idx) {
    this.optionsArray.removeAt(idx);
  }

  get optionsArray() {
    return this.challengeForm.get('options') as FormArray;
  }

  get type() {
    return this.challengeForm.get('type').value;
  }
}
