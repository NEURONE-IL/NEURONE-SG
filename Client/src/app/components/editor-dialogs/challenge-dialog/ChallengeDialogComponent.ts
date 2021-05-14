import { Component, Inject, ɵConsole } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditorService } from 'src/app/services/game/editor.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-challenge-dialog',
  templateUrl: 'challenge-dialog.html',
  styleUrls: ['challenge-dialog.scss'],
})
export class ChallengeDialogComponent {
  challengeForm: FormGroup;
  targetNodes: any;
  challenge: any;
  types: any;
  documents: any;
  loading = true;

  errors = [];

  constructor(
    private formBuilder: FormBuilder,
    public editorService: EditorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ChallengeDialogComponent>,
    private search: SearchService
  ) {
    const node = data.node;
    const adventureId = data.adventure;
    console.log('AVENTURA:  ', adventureId);
    this.search.fetchResults('*', null, adventureId, null).subscribe(
      (documents) => {
        this.documents = documents;
        this.documents = this.documents.filter((r) => r.type != 'image');
        this.loading = false;
      },
      (err) => {
        console.log(err);
      }
    );
    if (node.challenge) {
      this.challenge = node.challenge;
    } else {
      let localizedDefault = this.translate.instant('DEFAULT_CHALLENGE');
      this.challenge = {
        type: 'question',
        question: localizedDefault.QUESTION || "What's 5 + 15",
        answer: localizedDefault.ANSWER || '20',
      };
    }
    this.challengeForm = this.formBuilder.group({
      type: [Validators.required],
      question: [Validators.required],
      document: [],
      answer: [],
      options: this.formBuilder.array([]),
    });
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
    this.fetchOptions();
  }

  ngOnInit(): void {}

  saveChallenge() {
    let challenge = this.challengeForm.value;
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
    this.dialogRef.close({ challenge: challenge });
  }

  updateType(type) {
    console.log(type);
    console.log(this.challengeForm.value);
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
          console.log(this.challengeForm.value);
        }
      });
  }

  removeOption(idx) {
    this.optionsArray.removeAt(idx);
  }

  fetchOptions() {
    if (this.challenge.options) {
      this.challenge.options.forEach((option) => {
        console.log(option);
        this.optionsArray.push(this.formBuilder.group(option));
      });
    }
  }

  get optionsArray() {
    return this.challengeForm.get('options') as FormArray;
  }
}
