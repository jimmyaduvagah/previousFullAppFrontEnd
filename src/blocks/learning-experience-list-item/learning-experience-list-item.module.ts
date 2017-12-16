import { ErrorHandler, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicPageModule } from 'ionic-angular';
import { LearningExperienceListItemComponent } from './learning-experience-list-item';
import { TwzDirectivesModule } from '../../shared/directives/twzDirectives.module';


@NgModule({
    declarations: [
        LearningExperienceListItemComponent
    ],
    imports: [
        TwzDirectivesModule,
        IonicPageModule.forChild(LearningExperienceListItemComponent),

    ],
    exports: [
        LearningExperienceListItemComponent
    ],
    entryComponents: [

    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class LearningExperienceListItemModule {}
