import { ErrorHandler, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from "@angular/common";
import { IonicApp, IonicErrorHandler, IonicPageModule } from 'ionic-angular';
import { TwzDirectivesModule } from '../../shared/directives/twzDirectives.module';
import { LearningExperienceSectionComponent } from './learning-experience-section';
import { QuizModule } from '../quiz/quiz.module';


@NgModule({
    declarations: [
        LearningExperienceSectionComponent
    ],
    imports: [
        CommonModule,
        TwzDirectivesModule,
        QuizModule,
        IonicPageModule.forChild(LearningExperienceSectionComponent),

    ],
    exports: [
        LearningExperienceSectionComponent
    ],
    entryComponents: [

    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ],
    schemas: []
})
export class LearningExperienceSectionModule {}
