import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./page/home/home.component";
import { LoginComponent } from "./page/login/login.component";
import { DashboardComponent } from "./page/dashboard/dashboard.component";
import { NavbarComponent } from "./component/navbar/navbar.component";
import { SidebarComponent } from "./component/sidebar/sidebar.component";
import { ViewerComponent } from "./page/viewer/viewer.component";
import { FooterComponent } from "./component/footer/footer.component";
import { SignupComponent } from "./page/signup/signup.component";
import { ContactComponent } from "./page/contact/contact.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppInterceptorService } from "./services/app-interceptor.service";
import { ToastrModule } from "ngx-toastr";
import { SearchComponent } from "./component/search/search.component";
import { AvatarComponent } from "./component/avatar/avatar.component";
import { MainHeaderComponent } from "./component/main-header/main-header.component";
import { DocumentlistComponent } from "./component/documentlist/documentlist.component";
import { DocumentComponent } from "./component/document/document.component";
import { NewFolderModalComponent } from "./component/new-folder-modal/new-folder-modal.component";
import { CopyModalComponent } from "./component/copy-modal/copy-modal.component";
import { MoveModalComponent } from "./component/move-modal/move-modal.component";
import { RenameModalComponent } from "./component/rename-modal/rename-modal.component";
import { FolderlistComponent } from "./component/folderlist/folderlist.component";
import { CommentModalComponent } from "./component/comment-modal/comment-modal.component";
import { ActivityModalComponent } from "./component/activity-modal/activity-modal.component";
import { MemberModalComponent } from "./component/member-modal/member-modal.component";
import { ShareModalComponent } from "./component/share-modal/share-modal.component";
import { DeleteModalComponent } from "./component/delete-modal/delete-modal.component";
import { CommentComponent } from "./component/comment/comment.component";
import { LinkModalComponent } from "./component/link-modal/link-modal.component";
import { CopyClipboardDirective } from "./directives/copy-clipboard.directive";
import { ProfileComponent } from "./page/profile/profile.component";
import { MomentModule } from "ngx-moment";
import { ChangePasswordModalComponent } from "./component/change-password-modal/change-password-modal.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    ViewerComponent,
    FooterComponent,
    SignupComponent,
    ContactComponent,
    SearchComponent,
    AvatarComponent,
    MainHeaderComponent,
    DocumentlistComponent,
    DocumentComponent,
    NewFolderModalComponent,
    CopyModalComponent,
    MoveModalComponent,
    RenameModalComponent,
    FolderlistComponent,
    CommentModalComponent,
    ActivityModalComponent,
    MemberModalComponent,
    ShareModalComponent,
    DeleteModalComponent,
    CommentComponent,
    LinkModalComponent,
    CopyClipboardDirective,
    ProfileComponent,
    ChangePasswordModalComponent,
  ],
  entryComponents: [
    NewFolderModalComponent,
    CopyModalComponent,
    MoveModalComponent,
    RenameModalComponent,
    CommentModalComponent,
    ActivityModalComponent,
    MemberModalComponent,
    ShareModalComponent,
    DeleteModalComponent,
    LinkModalComponent,
    ChangePasswordModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
    }),
    MomentModule.forRoot({
      relativeTimeThresholdOptions: {
        m: 59,
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
