import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-new-web-resource-dialog',
  templateUrl: './new-web-resource-dialog.component.html',
  styleUrls: ['./new-web-resource-dialog.component.scss'],
})
export class NewWebResourceDialogComponent implements OnInit {
  adventure: any;
  resourceForm: FormGroup;
  nodes = [];
  resTypes: any;
  locales: any;
  uploading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private search: SearchService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.resTypes = [
      { value: 'document', viewValue: 'WEB_RESOURCES_TABLE.TYPES.PAGE' },
      { value: 'book', viewValue: 'WEB_RESOURCES_TABLE.TYPES.BOOK' },
      { value: 'video', viewValue: 'WEB_RESOURCES_TABLE.TYPES.VIDEO' },
    ];
    this.locales = [
      { value: 'es-CL', viewValue: 'NEW_WEB_RESOURCE_DIALOG.LOCALES.SPANISH' },
      { value: 'en-US', viewValue: 'NEW_WEB_RESOURCE_DIALOG.LOCALES.ENGLISH' },
    ];
    this.adventure = this.data.adventure;
    this.nodes.push({
      id: 'NO_NODE',
      label: 'NEW_WEB_RESOURCE_DIALOG.FORM.NO_NODE',
    });
    this.nodes = this.nodes.concat(this.adventure.nodes);
    this.setForm();
  }

  private setForm() {
    this.resourceForm = this.formBuilder.group({
      docName: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      type: [null, [Validators.required]],
      title: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      url: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200),
        ],
      ],
      domain: this.adventure._id,
      locale: [null, [Validators.required]],
      task: [null, [Validators.required]],
      /*NEURONE required*/
      maskedURL: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(200),
        ],
      ],
      relevant: false,
      searchSnippet: '',
      keywords: [[]],
    });
  }

  ngOnInit(): void {}

  get resourceFormCtrls() {
    return this.resourceForm.controls;
  }

  uploadResource() {
    this.resourceForm.markAllAsTouched();
    this.translate.get('NEW_WEB_RESOURCE_DIALOG.MESSAGES').subscribe(
      (messages) => {
        if (!this.resourceForm.valid) {
          this.toastr.warning(messages.INVALID_FORM);
        } else {
          this.uploading = true;
          this.search.upload(this.resourceForm.value).subscribe(
            (res) => {
              console.log(res);
              this.toastr.success(messages.SUCCESS);
              this.setForm();
              this.uploading = false;
            },
            (err) => {
              this.setForm();
              this.uploading = false;
              console.log(err);
              this.toastr.success(messages.ERROR);
            }
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
