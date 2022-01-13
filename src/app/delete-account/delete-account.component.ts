import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  constructor(private message: MessageService, private service: AuthService, private router : Router) { }

  ngOnInit(): void {
  }

  // executer la fonction après confirmation dans une boîte de dialogue
  deleteAccount():void{
    if (confirm("Are you sure you want to delete your account ? (this action is irreversible)")) {
      this.blockUI.start('Loading...');
      this.message.sendMessage('user/deleteAccount',{_id: this.service.userID}).subscribe(
        (response) => {
          this.service.logOut();
          this.router.navigate(['login']);
          this.blockUI.stop();
        },
        (err) => {
          console.log(err) ; //message d'erreur
          this.blockUI.stop();
        }
      )
    }
  }
}
