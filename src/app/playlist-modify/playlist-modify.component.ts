import { Component, Inject, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-playlist-modify',
  templateUrl: './playlist-modify.component.html',
  styleUrls: ['./playlist-modify.component.scss']
})
export class PlaylistModifyComponent implements OnInit {

  playlistId: string = "";
  playlistName: string = "";
  playlistDescription: string = "";
  playlistVisibility: string = "";

  @BlockUI()
  blockUI!: NgBlockUI;

  constructor(
    // public activeModal: NgbActiveModal, 
    private message: MessageService, 
    private toastrService: ToastrService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<PlaylistModifyComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    ) { 
      this.playlistId = data.playlistId;
      this.playlistName = data.playlistName;
      this.playlistDescription = data.playlistDescription;
      this.playlistVisibility = data.playlistVisibility;
    }

  ngOnInit(): void {
  }

  selectVisibility(event: any): void{
    this.playlistVisibility = event.target.value;
  }

  updatePlaylist(): void {
    const request = {
      _id: this.playlistId,
      name: this.playlistName,
      id_user: this.authService.userID,
      description: this.playlistDescription,
      status: this.playlistVisibility,
    };
    this.blockUI.start('Loading...');
    this.message.sendMessage('playlist/modifyPlaylist',request).subscribe(
      (res: any) => {
          if (res.success){
            this.toastrService.success('Playlist updated');
            this.dialogRef.close();
          }
          else if (res.errorSet.includes('ID_NOT_FOUND')) {
            this.toastrService.error('Playlist not exist');
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
