import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageAdsComponent } from './manage-ads/manage-ads.component';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { AdsDialogComponent } from './ads-dialog/ads-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToastrModule} from "ngx-toastr";
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule , MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from './customPaginator';
import {MatIconModule} from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BlockUIModule } from 'ng-block-ui';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { DashboardUserComponent } from './dashboard-user/dashboard-user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar/navbar.component';
import { PlaylistCreateComponent } from './playlist-create/playlist-create.component';
import { PlaylistDetailComponent } from './playlist-detail/playlist-detail.component';
import { PlaylistModifyComponent } from './playlist-modify/playlist-modify.component';
import { SearchContainerComponent } from './search-container/search-container.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { SearchListComponent } from './search-list/search-list.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { VideoSaveComponent } from './video-save/video-save.component';
import { WatchComponent } from './watch/watch.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { HistoryComponent } from './history/history.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { JwPaginationModule } from 'jw-angular-pagination';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    ManageUsersComponent,
    ManageAdsComponent,
    ConfirmDeleteDialogComponent,
    UserDialogComponent,
    AdsDialogComponent,
    LoginComponent,
    ForgetPasswordComponent,
    DashboardUserComponent,
    NavbarComponent,
    PlaylistCreateComponent,
    PlaylistDetailComponent,
    PlaylistModifyComponent,
    SearchContainerComponent,
    SearchInputComponent,
    SearchListComponent,
    UserSettingsComponent,
    VideoSaveComponent,
    WatchComponent,
    DeleteAccountComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatTableModule,
    HttpClientModule,
    MatPaginatorModule,
    MatIconModule,
    FontAwesomeModule,
    BlockUIModule.forRoot(), 
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    NgbModule,
    YouTubePlayerModule,
    JwPaginationModule,
    MatOptionModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: MatPaginatorIntl, useValue: CustomPaginator()}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
