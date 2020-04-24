import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MembersListComponent } from './members-list/members-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';

export const appRoutes : Routes = [
    { path: '', component: HomeComponent },
    { path: 'Home', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            { path: 'Members', component: MembersListComponent },
            { path: 'Messages', component: MessagesComponent },
            { path: 'Lists', component: ListsComponent },
        ]
    },
    { path: '**', redirectTo: 'Home', pathMatch: 'full' },
];