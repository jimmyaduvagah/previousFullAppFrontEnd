import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { DesktopModule } from '../desktop/desktop.module';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FeedPage } from '../pages/feed/feed';
import { PostService } from '../shared/services/post.service';
import { HttpModule } from '@angular/http';
import { HttpSettingsService } from '../shared/services/HttpSettingsService';
import { SessionService } from '../shared/services/session.service';
import { SettingsService } from '../shared/services/SettingsService';
import { AuthTokenService } from '../shared/services/authtoken.service';
import { LikeService } from '../shared/services/like.service';
import { PostComponent } from '../blocks/post/post';
import { PostTypeImageComponent } from '../blocks/post-types/post-type-image';
import { PostTypeTextComponent } from '../blocks/post-types/post-type-text';
import { PostTypeLinkComponent } from '../blocks/post-types/post-type-link';
import { PostTypeLinkSmallImageComponent } from '../blocks/post-types/post-type-link-small-image';
import { PostStore } from '../shared/services/post.store';
import { PostAuthorComponent } from '../blocks/post-author/post-author';
import { PostActionsComponent } from '../blocks/post-actions/post-actions';
import { FeedNewPostPage } from '../pages/feed-new-post/feed-new-post';
import { AuthService } from '../shared/services/auth.service';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { UserService } from '../shared/services/user.service';
import { RegisterPage } from '../pages/register/register';
import { RegisterService } from '../shared/services/register.service';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { LearningExperienceListPage } from '../pages/learning-experience-list/learning-experience-list';
import { LearningExperienceService } from '../shared/services/learning-experience.service';
import { LearningExperienceModuleListPage } from '../pages/learning-experience-module-list/learning-experience-module-list';
import { LearningExpereienceModuleService } from '../shared/services/course-module.service';
import { LearningExperienceModulePage } from '../pages/learning-experience-module/learning-experience-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuizComponent } from '../blocks/quiz/quiz';
import { CategoryService } from '../shared/services/category.service';
import { TwzDirectivesModule } from '../shared/directives/twzDirectives.module';
import { ProfilePage } from "../pages/profile/profile";
import { MorePagesPage } from "../pages/more-pages/more-pages";
import { LearningExperienceSectionCommentsPage } from '../pages/learning-experience-section-comments/learning-experience-section-comments';
import { ExperienceService } from "../shared/services/experience.service";
import { ImageViewPage } from "../pages/image-view/image-view";
import { ProfileEditPage } from "../pages/profile-edit/profile-edit";
import { FeedNewPostAddLinkPage } from "../pages/feed-new-post-add-link/feed-new-post-add-link";
import { LinkService } from "../shared/services/link.service";
import { SettingsPage } from "../pages/settings/settings";
import { AppUpdateService } from "../shared/services/app-update.service";
import { Camera } from "@ionic-native/camera";
import { ImagePicker } from "@ionic-native/image-picker";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { LearningExperienceImageService } from "../shared/services/learning-experience-image.service";
import { CourseModuleSectionsService } from "../shared/services/course-module-sections.service";
import {
  GalleryImageService, GalleryService,
  SectionGalleryService, SectionImageService,
  SectionTextService, SectionVideoService, QuizSectionService, QuestionSectionService, AnswerSectionService, SectionQuizService,
} from '../shared/services/learning-experience-sections.service';
import { PhotoService } from '../shared/services/photo.service';
import { File } from '@ionic-native/file';
import { TownService } from '../shared/services/town.service';
import { ModalSelectPage } from '../pages/modal-select/modal-select';
import { MainTabs } from '../pages/main-tabs/main-tabs';
import { ContactsPage } from '../pages/contacts/contacts';
import { PostDetailPage } from '../pages/post-detail/post-detail';
import { FeedService } from '../shared/services/feed.service';
import { CommentService } from '../shared/services/comment.service';
import { NationalityService } from '../shared/services/nationality.service';
import { SetupWizardPage } from '../pages/setup-wizard/setup-wizard';
import { ModalCountrySelectPage } from '../pages/modal-country-select/modal-country-select';
import { PhoneNumberProvider } from '../shared/services/PhoneNumberService';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { ConnectionService } from '../shared/services/connection.service';
import { ConnectionRequestService } from '../shared/services/connection-request.service';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { PostTypeVideoComponent } from '../blocks/post-types/post-type-video';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FileSizePipe } from '../shared/pipes/filesize.pipe';
import { IonicStorageModule } from '@ionic/storage';
import { StorageService } from '../shared/services/storage.service';
import { LearningExperienceOverviewPage } from '../pages/learning-experience-overview/learning-experience-overview';
import { LearningExperienceRatingPageModule } from '../pages/learning-experience-rating/learning-experience-rating.module';
import { ProfilePostService } from '../shared/services/profile-post.service';
import { PostReportService } from '../shared/services/post-report.service';
import { ReviewService } from '../shared/services/review.service';
import { LEProgressService } from '../shared/services/le-progress.service';
import { PeopleService } from '../shared/services/people.service';
import { PushTokenService } from '../shared/services/push-token.service';
import { NotificationsPage } from '../pages/notifications/notifications';
import { NotificationService } from '../shared/services/notification.service';
import { FromNowPipe } from '../shared/pipes/fromnow.pipe';
import { TwToastModule } from '../shared/modules/tw-toast/module';
import { ENV } from '../shared/constant/env';
import { NotificaionRoutingService } from '../shared/services/notification-routing.service';
import { ProfileExperienceEditPage } from '../pages/profile-experience-edit/profile-experience-edit';
import { InstitutionService } from '../shared/services/institution.service';
import { PhoneVerificationService } from '../shared/services/phone-verification.service';
import { ChangeNumberPage } from '../pages/change-phone/change-phone';
import { MomentFormatPipe } from '../shared/pipes/moment-format.pipe';
import { ModalTextInputPage } from '../pages/modal-text-input/modal-text-input';
import { ChangePasswordPage } from "../pages/change-password/change-password";
import { BugReportingPage } from "../pages/bug-reporting/bug-reporting";
import { NewBugReportPage } from "../pages/bug-new-report/bug-new-report";
import { BugService } from "../shared/services/bug.service";
import { MarkdownModule } from 'angular2-markdown';
import { Keyboard } from '@ionic-native/keyboard';
import { AnalyticsService } from '../shared/services/analytics.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { ProfileLearningExperienceService } from '../shared/services/profile-learning-experience.service';
import { CourseProgressService } from "../shared/services/course-progress.service";
import { LearningExperienceListItemModule } from '../blocks/learning-experience-list-item/learning-experience-list-item.module';
import { LearningExperienceSectionModule } from '../blocks/learning-experience-section/learning-experience-section.module';
import { QuizModule } from '../blocks/quiz/quiz.module';
import { SurveyService } from "../shared/services/survey.service";
import { SurveyModule } from '../pages/survey/module';
<<<<<<< HEAD
import { ElasticModule } from 'ng-elastic';

=======
import { SurveySectionService } from "../shared/services/survey-section.service";
import { MpesaPayoutService } from "../shared/services/mpesa-payout.service";
import { InvitePopoverPage } from "../pages/invite-pop-over/invite-pop-over";
import { UserInvitationCodeService } from "../shared/services/invitation.service";
>>>>>>> bbe4b4f62f5f803e2b0a2d9845a050cfc587dbe1

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'c40b81d6'
  },
  'push': {
    'sender_id': ENV.PUSH_GOOGLE_SENDER_ID,
    'pluginConfig': {
      'ios': {
        'badge': true,
          'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    FeedPage,
    RegisterPage,
    FeedNewPostPage,
    PostComponent,
    PostTypeImageComponent,
    PostTypeTextComponent,
    PostTypeLinkComponent,
    PostTypeLinkSmallImageComponent,
    PostAuthorComponent,
    InvitePopoverPage,
    PostActionsComponent,
    LoginPage,
    LogoutPage,
    ProfilePage,
    ProfileEditPage,
    ProfileExperienceEditPage,
    ForgotPasswordPage,
    ChangePasswordPage,
    BugReportingPage,
    NewBugReportPage,
    LearningExperienceListPage,
    LearningExperienceSectionCommentsPage,
    LearningExperienceModuleListPage,
    LearningExperienceModulePage,
    SettingsPage,
    ImageViewPage,
    FeedNewPostAddLinkPage,
    NotificationsPage,
    ModalSelectPage,
    MainTabs,
    SetupWizardPage,
    ContactsPage,
    ModalCountrySelectPage,
    ResetPasswordPage,
    PostTypeVideoComponent,
    PostDetailPage,
    ChangeNumberPage,
    FileSizePipe,
    FromNowPipe,
    MomentFormatPipe,
    ModalTextInputPage,
    MorePagesPage,
    LearningExperienceOverviewPage,
  ],
  imports: [
    DesktopModule,
    TwzDirectivesModule,
    QuizModule,
    LearningExperienceListItemModule,
    LearningExperienceSectionModule,
    BrowserModule,
    MarkdownModule.forRoot(),
    HttpModule,
    ElasticModule,
    TwToastModule,
    SurveyModule,
    LearningExperienceRatingPageModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      mode: 'md',
      ios: {
        scrollAssist: false,
        autoFocusAssist: false,
        inputBlurring: false
      }
    }),
    CloudModule.forRoot(cloudSettings),
    SuperTabsModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegisterPage,
    ListPage,
    FeedPage,
    ModalTextInputPage,
    ForgotPasswordPage,
    LogoutPage,
    LoginPage,
    ProfilePage,
    ProfileEditPage,
    InvitePopoverPage,
    ProfileExperienceEditPage,
    FeedNewPostPage,
    FeedNewPostAddLinkPage,
    LearningExperienceSectionCommentsPage,
    LearningExperienceListPage,
    LearningExperienceModulePage,
    LearningExperienceModuleListPage,
    NotificationsPage,
    ImageViewPage,
    ChangePasswordPage,
    SettingsPage,
    ModalSelectPage,
    MainTabs,
    ResetPasswordPage,
    SetupWizardPage,
    ChangeNumberPage,
    PostTypeVideoComponent,
    ContactsPage,
    ModalCountrySelectPage,
    PostDetailPage,
    MorePagesPage,
    LearningExperienceOverviewPage,
    BugReportingPage,
    NewBugReportPage,

  ],
  providers: [
    StatusBar,
    Keyboard,
    PhotoViewer,
    HttpSettingsService,
    ExperienceService,
    LearningExperienceService,
    ProfileLearningExperienceService,
    SessionService,
    NotificaionRoutingService,
    NotificationService,
    InstitutionService,
    UserService,
    AnalyticsService,
    GoogleAnalytics,
    SettingsService,
    RegisterService,
    FeedService,
    NationalityService,
    StorageService,
    ConnectionRequestService,
    CommentService,
    PhoneNumberProvider,
    LearningExpereienceModuleService,
    LearningExperienceImageService,
    CourseModuleSectionsService,
    PostReportService,
    LinkService,
    PushTokenService,
    AuthTokenService,
    SplashScreen,
    PostService,
    ProfilePostService,
    PostStore,
    PhotoService,
    ConnectionService,
    File,
    AuthService,
    TownService,
    AppUpdateService,
    LEProgressService,
    LikeService,
    CategoryService,
    PhoneVerificationService,
    SectionQuizService,
    PeopleService,
    SectionTextService,
    SectionImageService,
    SectionGalleryService,
    SectionVideoService,
    InAppBrowser,
    Camera,
    ImagePicker,
    GalleryImageService,
    GalleryService,
    QuizSectionService,
    QuestionSectionService,
    AnswerSectionService,
    ReviewService,
    BugService,
    CourseProgressService,
    SurveyService,
    UserInvitationCodeService,
    SurveySectionService,
    MpesaPayoutService,
    {
      provide: ErrorHandler, useClass: IonicErrorHandler
    },
  ]
})
export class AppModule {
}
