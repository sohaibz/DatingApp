import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MembersListComponent } from './members/members-list/members-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MembersDetailComponent } from './members/members-detail/members-detail.component';
import { MemberDetailResolver } from './_resolvers/members-detail.resolver';
import { MemberListResolver } from './_resolvers/members-list.resolver';
import { MembersEditComponent } from './members/members-edit/members-edit.component';
import { MemberEditResolver } from './_resolvers/members-edit.resolver';
import { PreventUnSavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { ListsResolver } from './_resolvers/lists.resolver';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Home', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'Members',
        component: MembersListComponent,
        resolve: { users: MemberListResolver },
      },
      {
        path: 'Members/:id',
        component: MembersDetailComponent,
        resolve: { user: MemberDetailResolver },
      },
      {
        path: 'Member/Edit',
        component: MembersEditComponent,
        resolve: { user: MemberEditResolver },
        canDeactivate: [PreventUnSavedChanges]
      },
      { path: 'Messages', component: MessagesComponent },
      { path: 'Lists', component: ListsComponent, resolve: {users: ListsResolver} },
    ],
  },
  { path: '**', redirectTo: 'Home', pathMatch: 'full' },
];
