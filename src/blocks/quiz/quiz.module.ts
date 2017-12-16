import { ErrorHandler, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from "@angular/common";
import { IonicApp, IonicErrorHandler, IonicPageModule } from 'ionic-angular';
import { TwzDirectivesModule } from '../../shared/directives/twzDirectives.module';
import { QuizComponent } from './quiz';


@NgModule({
    declarations: [
        QuizComponent
    ],
    imports: [
        CommonModule,
        TwzDirectivesModule,
        IonicPageModule.forChild(QuizComponent),

    ],
    exports: [
        QuizComponent
    ],
    entryComponents: [

    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ],
    schemas: []
})
export class QuizModule {}
