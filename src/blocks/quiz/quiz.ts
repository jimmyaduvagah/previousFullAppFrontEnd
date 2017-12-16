import { Component, AfterViewInit, Input, OnInit } from '@angular/core';
import { QuizSection } from '../../shared/models/Quiz';
import { LEProgressService } from '../../shared/services/le-progress.service';
import { ToastController } from 'ionic-angular';


@Component({
  selector: 'quiz',
  templateUrl: 'quiz.html'
})
export class QuizComponent implements AfterViewInit, OnInit {

  @Input()
  public section: QuizSection;

  @Input()
  public editMode: boolean = false;

  public userAnswers = {};

  constructor(
    private _LEProgressService: LEProgressService,
    private _toastCtrl: ToastController
  ) {
  }

  showToast(msg, time=3000) {
    let toast = this._toastCtrl.create({
      message: msg,
      duration: time,
      position: 'top'
    });
    toast.present();
  }


  ngOnInit() {
    if (!this.editMode) {
      if (this._LEProgressService.sectionHasInObject(this.section.section_id, 'userAnswers')) {
        this.userAnswers = this._LEProgressService.getFieldInSectionObject(this.section.section_id, 'userAnswers');
      } else {
        for (let question of this.section.quiz.quiz_questions) {
          this.userAnswers[question.id] = {
            chosen: [],
            correct: null
          };
        }
      }
    } else {
      for (let question of this.section.quiz.quiz_questions) {
        this.userAnswers[question.id] = {
          chosen: [],
          correct: null
        };
      }

    }
  }

  ngAfterViewInit() {
  }

  answerTapped($event, question, answer) {
    if (!this.editMode){
      $event.srcEvent.noFab = true;
      let isDifferentChoice = true;
      if (this.userAnswers[question.id]['correct'] === true) {
        isDifferentChoice = false;
        this.showToast('You already answered this correctly!');
      } else {
        if (this.userAnswers[question.id]['chosen'].length > 0) {
          if (this.userAnswers[question.id]['chosen'][0] === answer.id) {
            isDifferentChoice = false;
          }
        }
      }
      if (isDifferentChoice) {
        this.userAnswers[question.id]['chosen'].unshift(answer.id);
        if ( question.correct_answer === answer.id) {
          this.userAnswers[question.id]['correct'] = true;
        } else {
          this.showToast('Try again');
          this.userAnswers[question.id]['correct'] = false;
        }
        this._LEProgressService.updateObjectField(this.section.section_id, 'userAnswers', this.userAnswers).subscribe((res) => {
          // saved
          console.log('quiz', res);
        }, (res) => {
          // saved
          console.log('quiz error', res);
        });
      }
    }
  }

  quizComplete() {
    let complete = true;
    for (let question of this.section.quiz.quiz_questions) {
      if (this.userAnswers[question.id]['correct'] !== true) {
        complete = false;
        return complete;
      }
    }
    return complete;
  }

}
