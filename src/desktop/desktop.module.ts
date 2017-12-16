import { DesktopComponent } from "./desktop.component";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListLe } from './pages/list-le/list-le';
import { NewLeModule } from "./pages/new-le-module/new-le-module";
import { AddNewCategory } from './pages/add-new-category/add-new-category';
import { NewModuleSection } from "./pages/new-module-section/new-module-section";
import { TwzDirectivesModule } from '../shared/directives/twzDirectives.module';
import { AddNewLe } from './pages/add-new-le/add-new-le';
import { ListLeCategories } from './pages/list-category/list-category';
import { AddSection } from './pages/add-section/add-section';
import { EditLe } from './pages/edit-le/edit-le';
import { EditCategory } from './pages/edit-category/edit-le-category';
import { ListModuleSections } from './pages/list-module-sections/list-module-sections';
import { ListLeModules } from './pages/list-le-modules/list-le-modules';
import { EditLeModule } from './pages/edit-le-module/edit-le-module';
import { ColorPicker } from "./blocks/color-picker/color-picker";
import { EditModuleSections } from "./pages/edit-module-section/edit-module-section";
import { ElasticModule } from 'ng-elastic';
import { AddSectionQuiz } from "./pages/add-section-quiz/add-section-quiz";
import { PopoverPage } from "./pages/pop-over-page/pop-over";
import { EditAnswer } from "./pages/edit-answer/edit-answer";
import { EditQuestion } from "./pages/edit-question/edit-question";
import { EditGalleryImage } from "./pages/edit-gallery-image/edit-gallery-image";
import { DashboardLe } from "./pages/le-dashboard/dashboard-le";
import { LearningExperienceListItemModule } from '../blocks/learning-experience-list-item/learning-experience-list-item.module';
import { LearningExperienceSectionModule } from '../blocks/learning-experience-section/learning-experience-section.module';
import { QuizModule } from '../blocks/quiz/quiz.module';
import { addNewSurvey } from "./pages/add-new-survey/add-new-survey";
import { dashboardUserActivity } from "./pages/user-activity-dashboard/dashboard-user-activity";
import { listSurvey } from "./pages/list-survey/list-survey";
import { editSurvey } from "./pages/edit-survey/edit-survey";
import { LeWeek } from "./pages/le-weeks/week-le";
import { AddSectionSurvey } from "./pages/add-section-survey/add-section-survey";
import {EditSectionSurvey} from "./pages/edit-survey-section/edit-survey-section";
import {listSurveyResponses} from "./pages/list-survey-responses/list-survey-responses";
import {SurveyResponseDetails} from "./pages/survey-response-details/survey-response-details";
import { SubmissionCreatePage } from './pages/submission-create/submission-create';
import { SubmissionEulaPage } from './pages/submission-eula/submission-eula';
import { SubmissionListPage } from './pages/submission-list/submission-list';
import { LESubmissionService } from '../shared/services/le-submission.service';
import { StarsViewPipe } from '../shared/pipes/stars-view.pipe';
import { SubmissionViewPage } from './pages/submission-view/submission-view';
import { LESubmissionRatingService } from '../shared/services/le-submission-rating.service';
import { FileSelectService } from '../shared/services/file-select.service';
import { WordCountPipe } from '../shared/pipes/word-cound.pipe';
import { SubmissionRatingsListPage } from './pages/submission-ratings-list/submission-ratings-list';




@NgModule({
  declarations: [
    DesktopComponent,
    AddNewLe,
    ListLe,
    NewLeModule,
    AddNewCategory,
    NewModuleSection,
    ListLeModules,
    ListLeCategories,
    AddSection,
    EditLe,
    EditCategory,
    ListModuleSections,
    EditLeModule,
    ColorPicker,
    EditModuleSections,
    AddSectionQuiz,
    PopoverPage,
    EditGalleryImage,
    EditAnswer,
    EditQuestion,
    DashboardLe,
    dashboardUserActivity,
    addNewSurvey,
    listSurvey,
    editSurvey,
    dashboardUserActivity,
    LeWeek,
    AddSectionSurvey,
    EditSectionSurvey,
    listSurveyResponses,
    SurveyResponseDetails,
    SubmissionCreatePage,
    SubmissionViewPage,
    SubmissionRatingsListPage,
    SubmissionEulaPage,
    SubmissionListPage,
    StarsViewPipe,
    WordCountPipe
  ],
  imports: [
    BrowserModule,
    TwzDirectivesModule,
    QuizModule,
    LearningExperienceListItemModule,
    LearningExperienceSectionModule,
    HttpModule,
    ElasticModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(DesktopComponent),
  ],
  bootstrap: [
    IonicApp,
    DesktopComponent,
    AddNewLe,
    ListLe,
    NewLeModule,
    AddNewCategory,
    NewModuleSection,
    ListLeModules,
    ListLeCategories,
    AddSection,
    EditLe,
    EditCategory,
    ListModuleSections,
    EditLeModule,
    ColorPicker,
    EditModuleSections,
    AddSectionQuiz,
    PopoverPage,
    EditGalleryImage,
    EditAnswer,
    EditQuestion,
    DashboardLe,
    dashboardUserActivity,
    addNewSurvey,
    listSurvey,
    editSurvey,
    dashboardUserActivity,
    LeWeek,
    AddSectionSurvey,
    EditSectionSurvey,
    listSurveyResponses,
    SurveyResponseDetails,
    SubmissionCreatePage,
    SubmissionViewPage,
    SubmissionEulaPage,
    SubmissionRatingsListPage,
    SubmissionListPage,
  ],
  entryComponents: [
    DesktopComponent,
    AddNewLe,
    ListLe,
    NewLeModule,
    NewModuleSection,
    ListLeModules,
    ListLeCategories,
    AddSection,
    EditLe,
    EditCategory,
    ListModuleSections,
    EditLeModule,
    ColorPicker,
    EditModuleSections,
    AddSectionQuiz,
    PopoverPage,
    EditGalleryImage,
    EditAnswer,
    EditQuestion,
    DashboardLe,
    dashboardUserActivity,
    addNewSurvey,
    listSurvey,
    editSurvey,
    dashboardUserActivity,
    LeWeek,
    AddSectionSurvey,
    EditSectionSurvey,
    listSurveyResponses,
    SurveyResponseDetails,
    SubmissionCreatePage,
    SubmissionViewPage,
    SubmissionEulaPage,
    SubmissionListPage,
  ],
  providers: [
    LESubmissionService,
    LESubmissionRatingService,
    FileSelectService
  ]

})
export class DesktopModule {
}

