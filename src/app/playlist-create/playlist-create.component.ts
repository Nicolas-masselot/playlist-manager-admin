import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-playlist-create',
  templateUrl: './playlist-create.component.html',
  styleUrls: ['./playlist-create.component.scss']
})
export class PlaylistCreateComponent implements OnInit {
  
  playlistName: string = "";
  playlistDescription: string = "";
  playlistVisibility: string = "PUBLIC";

  @BlockUI()
  blockUI!: NgBlockUI;

  constructor(public activeModal: NgbActiveModal, 
    private message: MessageService, 
    private toastrService: ToastrService,
    private authService: AuthService) { }

  ngOnInit(): void {
  }

  addPlaylist(): void {
    if (this.playlistName === '') {
      this.toastrService.error('Enter email and password');
    } else {
      const request = {
        name: this.playlistName,
        id_user: this.authService.userID,
        description: this.playlistDescription,
        status: this.playlistVisibility,
      };
      this.blockUI.start('Loading...');
      this.message.sendMessage('playlist/createPlaylist',request).subscribe(
        (res) => {
          if (res.success){
            this.toastrService.success('Create successfully');
            this.blockUI.stop();
            this.activeModal.close();
          }
          else{
            this.blockUI.stop();
          }
        },
        (err)=>{ 
          console.log(err); // message d'erreur
          this.blockUI.stop();
        }
      ) ;
    }
  }

  selectVisibility(event: any): void{
    this.playlistVisibility = event.target.value;
  }

}
