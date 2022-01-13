import { FormControl } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from '../services/message.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { Video } from '../interface/video';
import { Playlist } from '../interface/playlist';

@Component({
  selector: 'app-video-save',
  templateUrl: './video-save.component.html',
  styleUrls: ['./video-save.component.scss']
})
export class VideoSaveComponent implements OnInit {

  @BlockUI()
  blockUI!: NgBlockUI;

  AllPlaylists: Playlist[] = [];

  playlistList = new FormControl();
  video: Video | undefined

  constructor(
    // public activeModal: NgbActiveModal
    private message: MessageService, 
    private toastrService: ToastrService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<VideoSaveComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    ) { 
      this.video = data.video;
    }

  ngOnInit(): void {
    this.getAllPlaylist();
  }

  getAllPlaylist(): void {
    this.blockUI.start('Loading...');
    const request = {
      id_user: this.authService.userID,
    };
    this.message.sendMessage('playlist/getByUserId',request).subscribe(
      (res:any) => {
        if (res.success){
          this.AllPlaylists = res.data.map((playlist: {date_add:Date | any, description: string, name: string, status:string, thumbnail:string, videos:[], _id: string }) => {
            return {
              title: playlist.name,
              description: playlist.description,
              publishedAt: new Date(playlist.date_add),
              thumbnail: (playlist.thumbnail !== "") ? playlist.thumbnail : "https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault_live.jpg",
              playlistId: playlist._id,
              channelTitle: this.authService.userEmail,
              status: playlist.status.toUpperCase(),
            }
          });
          this.blockUI.stop();
        }
        else{
          if (res.errorSet.includes('PLAYLIST_NOT_FOUND')) {
            this.toastrService.error('Playlist not found');
          }
          this.blockUI.stop();
        }
      },
      (err)=>{ 
        console.log(err); // message d'erreur
        this.blockUI.stop();
      }
    ) ;
    this.blockUI.stop();
  }

  addToPlaylist(): void {
    if (this.playlistList.value){
      const request = {
        videoId: this.video?.videoId,
        videoUrl: this.video?.videoUrl,
        title: this.video?.title,
        channelId: this.video?.channelId,
        channelUrl: this.video?.channelUrl,
        channelTitle: this.video?.channelTitle,
        description: this.video?.description,
        publishedAt: this.video?.publishedAt,
        thumbnail: this.video?.thumbnail,
        playlists: this.playlistList.value,
      };
      this.blockUI.start('Loading...');
      this.message.sendMessage('video/saveVideo',request).subscribe(
        (res:any) => {
          if (res.success){
            this.toastrService.success('Save video successfully');
            this.dialogRef.close();
          }
          else if (res.errorSet.includes('VIDEO_SAVE_FAILED')) {
            this.toastrService.error('Save video failed');
          }
          this.blockUI.stop();
        },
        (err)=>{ 
          console.log(err); // message d'erreur
          this.blockUI.stop();
        }
      );
      this.blockUI.stop();
    }
  }

}
