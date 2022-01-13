import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faFacebookF, faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';
import { ToastrService } from 'ngx-toastr';

import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  containerClass: string[] = ['container'];

  faFacebook = faFacebookF;
  faGoogle = faGoogle;
  faApple = faApple;

  login: string = "";
  password: string = "";

  isAdvertiser: boolean | undefined ; 

  constructor(
    private toastrService: ToastrService,
    private service: AuthService, 
    private message: MessageService, 
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  toggleRightPanel(value: boolean): void{
    if (value){
      this.containerClass.push('right-panel-active')
    }
    else{
      this.containerClass.pop()
    }
  }

  selectRole(event: any): void{
    this.isAdvertiser = event.target.value;
  }

  signIn(email:string,password:string): void{
    if (email === '' || password === '') {
      this.toastrService.error('Enter email and password');
    } else {
      this.blockUI.start('Loading...');
      this.service.sendAuthentification(email,password).subscribe(
        (response:any) => {
          this.service.finalizeAuthentification(response);
          if (this.service.LoggedIn) {
            this.service.userEmail = email;
            this.router.navigateByUrl("dashboardUser").then(()=>{}) ;
          } else {
            if (response.errorSet.includes('AUTHENTICATION_FAILED')) {
              this.toastrService.error('Wrong password');
            }
            else if (response.errorSet.includes('EMAIL_NOT_FOUND')) {
              this.toastrService.error('Email not found');
            }
          }
          this.blockUI.stop();
        },
        (err) => {
          console.log(err) ;
          this.blockUI.stop();
        }
      )
      
    }
  }

  signUp(email:string,password:string,passConfirm:string): void{
    if (email === '' || password === '') {
      this.toastrService.error('Enter email and password');
    } else {
      if (password !== passConfirm) {
        this.toastrService.error('Password does not match');
      }
      else{
        if (this.isAdvertiser === undefined){
          this.toastrService.error('Please choose role');
        }
        else{
          const creationData = {
            email,
            password,
            ads:this.isAdvertiser
          }
          // console.log("isAdvertiser: ", this.isAdvertiser);
          this.blockUI.start('Loading...');
          this.message.sendMessage('user/createAccount',creationData).subscribe(
            (response) => {
              this.router.navigateByUrl('').then(()=>{}) ;
              /// TODO : check if email exists -> create successfully or failed
              this.toastrService.success('Create successfully');
              this.blockUI.stop();
            },
            (err)=>{ 
              console.log(err); // message d'erreur
              this.blockUI.stop();
            }
          ) ;
        }
      }
    }
    

  }

}

