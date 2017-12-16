import { IonicModule } from 'ionic-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ImageModule } from '../../directives/image.module';
import { SurveyPage } from './survey';
import { SurveyService } from '../../shared/services/survey.service';
import { TwzDirectivesModule } from '../../shared/directives/twzDirectives.module';
import { SurveyQuestionComponent } from './survey-question';
import { ElasticModule } from 'ng-elastic';
import { SurveyResponseService } from '../../shared/services/survey-response.service';

@NgModule({
  declarations: [
    SurveyPage,
    SurveyQuestionComponent
  ],
  imports: [
    BrowserAnimationsModule,
    TwzDirectivesModule,
    IonicModule,
    ElasticModule
  ],
  exports: [
    SurveyQuestionComponent
  ],
  entryComponents: [
    SurveyPage,
  ],
  providers: [
    SurveyService,
    SurveyResponseService
  ]
})
export class SurveyModule {
}
