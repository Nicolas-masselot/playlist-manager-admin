import { PlaylistModifyComponent } from '../playlist-modify/playlist-modify.component';
import { Playlist } from '../interface/playlist';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Video } from '../interface/video';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {MatDialog} from '@angular/material/dialog';
import { VideoDB } from '../interface/videoDB';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html',
  styleUrls: ['./playlist-detail.component.scss']
})
export class PlaylistDetailComponent implements OnInit {
  @BlockUI()
  blockUI!: NgBlockUI;
  
  playlist!: Playlist;
  playlistVideo!: VideoDB[]; 
  playlistId: string = "";
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private toastrService: ToastrService,
    private authService: AuthService, 
    private message: MessageService, 
    private dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.playlistId = this.route.snapshot.params["id"];
    this.getPlaylistById();
    this.getVideosOfPlaylist();
  }

  getPlaylistById(): void {
    this.blockUI.start('Loading...');
    const request = {
      _id: this.playlistId,
    };
    this.message.sendMessage('playlist/getById',request).subscribe((res:any) => {
      if (res.success){
        this.playlist = res.data.map((playlist: {date_add:Date | any, description: string, name: string, status:string, thumbnail:string, videos:[], _id: string }) => {
          return {
            title: playlist.name,
            description: playlist.description,
            publishedAt: new Date(playlist.date_add),
            thumbnail: (playlist.thumbnail !== "") ? playlist.thumbnail : "https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault_live.jpg",
            playlistId: playlist._id,
            channelTitle: this.authService.userEmail,
            status: playlist.status.toUpperCase(),
          }
        })[0];
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
    })
    this.blockUI.stop();
  }

  getVideosOfPlaylist() : void {
    this.blockUI.start('Loading...');
    const request = {
      id_playlist: this.playlistId,
    };
    this.message.sendMessage('video/getAllByPlaylistId',request).subscribe((res:any) => {
      if (res.success){
        this.playlistVideo = res.data.map((video: {channelId: string, channelTitle: string, channelUrl: string, description: string, publishedAt: Date | any, thumbnail: string, title: string, _id: string, videoId: string, videoUrl: string, }) => {
          return {
            _id: video._id,
            title: video.title,
            videoId: video.videoId,
            videoUrl: video.videoUrl,
            channelId: video.channelId,
            channelUrl: video.channelUrl,
            channelTitle: video.channelTitle,
            description: video.description,
            publishedAt: new Date(video.publishedAt),
            thumbnail: video.thumbnail
          };
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
    })
    this.blockUI.stop();    

  }

  modifyPlaylist():void {
    const dialogRef = this.dialog.open(PlaylistModifyComponent, {
      data: {
        playlistId: this.playlistId,
        playlistName: this.playlist.title, 
        playlistDescription: this.playlist.description,
        playlistVisibility: this.playlist.status
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      this.getPlaylistById();
      this.getVideosOfPlaylist();
    });
  }

  deletePlaylist():void{
    if (confirm("Are you sure you want to delete this playlist ? (this action is irreversible)")) {
      this.blockUI.start('Loading...');
      this.message.sendMessage('playlist/deletePlaylist',{_id: this.playlistId}).subscribe(
        (res:any) => {
          if (res.success){
            this.toastrService.success('Playlist deleted');
            this.router.navigate(['dashboardUser']);
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

  watchVideo(video: Video){
    const videoUrl = video.videoId;
    const url = "watch/" + videoUrl;
    this.router.navigateByUrl(url, { state: { video: video } });
  }

  deleteVideo(_id: string):void {
    const request = {
      _id: _id,
      id_playlist: this.playlistId,
    };
    if (confirm("Are you sure you want to delete this video ? (this action is irreversible)")) {
      this.blockUI.start('Loading...');
      this.message.sendMessage('video/removeVideoFromPlaylist',request).subscribe(
        (res:any) => {
          if (res.success){
            this.toastrService.success('Video deleted');
            this.getVideosOfPlaylist();
            this.getPlaylistById();
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
}
