import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';
import { faEye , faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  currentPassword:string | undefined;
  newPassword:string | undefined;
  newConfirm:string | undefined;
  faEye = faEye ;
  faEyeSlash = faEyeSlash ;
  showCurrent = false;
  showNewPass = false ;
  showNewConfirm = false; 

  constructor(private message: MessageService, 
    private authService: AuthService,
    private toastrService: ToastrService, ) { }

  ngOnInit(): void {
  }

  updatePassword():void {
    if (this.currentPassword === '' || this.newPassword === '' || this.newConfirm === '') {
      this.toastrService.error('Enter current password and new password');
    }
    else if (this.newPassword !== this.newConfirm) {
      this.toastrService.error('Confirmed password does not match');
    }
    else{
      this.blockUI.start('Loading...');
      const request = {
        _id: this.authService.userID,
        oldPassword: this.currentPassword,
        newPassword: this.newPassword,
      };
      this.message.sendMessage('user/modifyPassword',request).subscribe(
        (response:any) => {
          if (response.success){
            this.toastrService.success('Update password successfully');
          }
          else
          if (response.errorSet.includes('WRONG_PASSWORD')) {
            this.toastrService.error('Wrong current password');
          }
          
          this.blockUI.stop();
        },
        (err) => {
          console.log(err) ; //message d'erreur
          this.blockUI.stop();
        }
      )
      this.blockUI.stop();
    }
  }

  showPasswords(champMdp: number):void {
    switch (champMdp) {
      case 1:
        this.showCurrent = !this.showCurrent;
        break;
      case 2:
        this.showNewPass = !this.showNewPass;  
        break;
      case 3:
        this.showNewConfirm = !this.showNewConfirm ;
        break;
      default:
        break;
    }
  }
}
