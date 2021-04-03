import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-bookmark-form',
  templateUrl: './bookmark-form.component.html',
  styleUrls: ['./bookmark-form.component.scss']
})
export class BookmarkFormComponent implements OnInit {
  answerForm: FormGroup;

  @Input()
  adventure: any;

  @Input()
  currentNode: any;

  @Input()
  challenge;

  @Output()
  challengeFinishedEvent = new EventEmitter<boolean>();

  question: string;

  currentPage: any;

  bookmarkedPage: any;

  currentPageSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private search: SearchService
  ) {}

  ngOnInit(): void {
    this.question = this.challenge.question;

    this.answerForm = this.formBuilder.group({
      answer: ['', Validators.required],
      adventure: [this.adventure._id],
      document: ['', Validators.required],
      user: [this.auth.getUser()._id],
      node: [this.currentNode._id],
      type: ["bookmark"]
    });

    this.currentPageSubscription = this.search.currentPageSubject.subscribe(
      (currentPage) => {
        this.currentPage = currentPage;
      }
    )
  }

  get answersArray() {
    return this.answerForm.get('answer') as FormArray;
  }

  sendAnswer() {
    if (this.answerForm.valid) {
      const answer = this.answerForm.value;
      this.challengeFinishedEvent.emit(answer);
    } else {
      console.log('invalid answer form');
      // TODO: add toaster
    }
  }

  bookmarkPage() {
    this.answerForm.controls.document.setValue(this.currentPage._id);
    this.bookmarkedPage = this.currentPage;
    console.log('bookmarked page: ', this.bookmarkedPage);
  }
  unBookmarkPage() {
    this.answerForm.controls.document.setValue(null);
    this.bookmarkedPage = null;
    console.log('bookmarked page: ', this.bookmarkedPage);
  }
}
