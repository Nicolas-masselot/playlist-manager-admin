import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { DashboardUserComponent } from './dashboard-user/dashboard-user.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { HistoryComponent } from './history/history.component';
import { LoginComponent } from './login/login.component';
import { ManageAdsComponent } from './manage-ads/manage-ads.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { PlaylistDetailComponent } from './playlist-detail/playlist-detail.component';
import { SearchContainerComponent } from './search-container/search-container.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { WatchComponent } from './watch/watch.component';

const routes: Routes = [
  {
    path: 'login',
    component:LoginComponent
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboardUser',
        component: DashboardUserComponent
      },
      {
        path: 'userSettings',
        component: UserSettingsComponent
      },
      {
        path:'deleteAccount',
        component: DeleteAccountComponent
      },
      {
        path:'search',
        component: SearchContainerComponent
      },
      { path: 'watch/:id', 
        component: WatchComponent 
      },
      { path: 'history', 
        component: HistoryComponent 
      },
      { path: 'playlist/:id', 
        component: PlaylistDetailComponent 
      },
      {
        path: 'manageAds',
        component: ManageAdsComponent
      },
      {
        path: 'manageUsers',
        component: ManageUsersComponent
      },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
