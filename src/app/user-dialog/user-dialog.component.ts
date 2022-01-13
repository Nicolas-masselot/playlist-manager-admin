import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../services/message.service';
import { faEye , faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import { FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;
  
  dialogType = "addUser";
  email:string = "" ;
  mdp:string ="" ;
  ConfirmPass:string = "" ;
  role:string = "";
  userID:string | undefined ;
  resetDisable = false;
  titleMessage:string = "Add new User";
  SavebuttonText: string = "Save changes" ;
  env = environment ;

  showNewPass = false ;
  showNewConfirm = false; 
  faEye = faEye ;
  faEyeSlash = faEyeSlash ;

  emailFieldClass:string = "settingInputs" ;
  PasswordFieldClass:string = "settingInputs" ;
  ConfirmFieldClass:string = "settingInputs" ;
  RoleFieldClass:string = "settingInputs" ;

  emailInvalid:boolean = false ;
  passwordRequired:boolean = false ;
  confirmRequired:boolean = false ;
  roleRequired:boolean = false ;
  passwordsMatchError:boolean = false ;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any
  ,private dialogRef: MatDialogRef<UserDialogComponent>
  ,private service:MessageService
  ,private toastr: ToastrService) { 
    this.dialogType = data.dialogType ;
    if (data.idUser) {
      this.userID = data.idUser ;
    }
    if (data.mail) {
      this.email = data.mail ;
    }

    if (this.dialogType === 'addUser') {
      this.titleMessage = "Add a new user";
      this.SavebuttonText = "Add the user" ;
    }else {
      this.titleMessage = "Edit User profile" ;
      this.SavebuttonText = "Save changes" ;
    }
  }

  ngOnInit(): void {
  }

  OnSaveData():void{
    
    let emailaddress= new FormControl(this.email,[
      Validators.required,
      Validators.email
    ]);
  
    let passwordField = new FormControl(this.mdp,[
      Validators.required
    ]);
  
    let ConfirmField = new FormControl(this.ConfirmPass,[
      Validators.required
    ]);
  
    let RoleField = new FormControl(this.role,[
      Validators.required
    ]);

    if (passwordField.errors != null && this.dialogType === 'addUser') {
      this.PasswordFieldClass = "settingInputsError";
      this.passwordRequired = true ;
    } else {
      this.PasswordFieldClass = "settingInputs";
      this.passwordRequired = false ;
    }

    if (ConfirmField.errors != null && this.dialogType === 'addUser') {
      this.ConfirmFieldClass = "settingInputsError";
      this.confirmRequired = true ;
    } else {
      this.ConfirmFieldClass = "settingInputs";
      this.confirmRequired = false ;
    }

    if (RoleField.errors != null && this.dialogType === 'addUser') {
      this.RoleFieldClass = "settingInputsError";
      this.roleRequired = true ;
    } else {
      this.RoleFieldClass = "settingInputs";
      this.roleRequired = false;
    }

    if (emailaddress.errors != null) {
      this.emailFieldClass = "settingInputsError";
      this.emailInvalid = true ;
    } else {
      this.emailFieldClass = "settingInputs";
      this.emailInvalid = false;
    }

    if (this.mdp !== this.ConfirmPass ) {
      this.ConfirmFieldClass = "settingInputsError";
      this.passwordsMatchError = true ;
    } else if (!this.confirmRequired) {
      this.ConfirmFieldClass = "settingInputs";
      this.passwordsMatchError = false;
    }
    
    console.log(this.role);
    let errorsInform = this.passwordRequired || this.confirmRequired || this.roleRequired || this.emailInvalid || this.passwordsMatchError ;

    if ( !errorsInform && this.dialogType === 'addUser') {
      this.dialogRef.close({email:this.email,mdp:this.mdp,mdpConfirm:this.ConfirmPass,role:this.role});
    } else if (!errorsInform && this.dialogType === 'editUser') {
      this.dialogRef.close({user:this.userID,email:this.email,changed:true});
    }
    
  }

  resetPass():void{
    this.resetDisable = true ;
    this.service.sendMessage('resetUserPass',{idUser: this.userID}).subscribe(
      (response)=> {
        this.toastr.success("User's password reset successful");
        this.resetDisable = false ;
      },
      (error)=>{
        this.toastr.error("An error has occured");
        console.log(error) ;
        this.resetDisable = false ;
      }
    );
  }

  showPasswords(champMdp: number):void {
    switch (champMdp) {
      case 1:
        this.showNewPass = !this.showNewPass;
        break;
      case 2:
        this.showNewConfirm = !this.showNewConfirm ; 
        break;
      default:
        break;
    }
  }
}
