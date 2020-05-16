import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Pipe } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { appRoutes } from './routes';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_services/Auth.service';
import { UserService } from './_services/User.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_services/Error.Interceptor';
import {TimeAgoPipe} from 'time-ago-pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { MembersListComponent } from './members/members-list/members-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MembersCardComponent } from './members/members-card/members-card.component';
import { environment } from 'src/environments/environment';
import { MembersDetailComponent } from './members/members-detail/members-detail.component';
import { MemberDetailResolver } from './_resolvers/members-detail.resolver';
import { MemberListResolver } from './_resolvers/members-list.resolver';
import { MembersEditComponent } from './members/members-edit/members-edit.component';
import { MemberEditResolver } from './_resolvers/members-edit.resolver';
import { PreventUnSavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';

export function tokenGetter() {
  return localStorage.getItem('token');
}

export function domainGetter(): string {
  let hostname: string = new URL(environment.apiUrl).hostname;
  let port: string = new URL(environment.apiUrl).port;

  if (port == '') {
    return hostname;
  }

  return hostname + ':' + port;
}

@Pipe({
  name: 'timeAgo',
  pure: false
})
export class TimeAgoExtendsPipe extends TimeAgoPipe {}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MembersListComponent,
    ListsComponent,
    MessagesComponent,
    MembersCardComponent,
    MembersDetailComponent,
    MembersEditComponent,
    PhotoEditorComponent,
    TimeAgoExtendsPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    NgxGalleryModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [domainGetter()],
      },
    }),
    TabsModule.forRoot(),
    FileUploadModule
  ],
  providers: [
    AuthService,
    UserService,
    ErrorInterceptorProvider,
    MemberDetailResolver,
    MemberListResolver,
    MemberEditResolver,
    PreventUnSavedChanges,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
