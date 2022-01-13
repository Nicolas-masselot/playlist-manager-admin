import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Playlist } from '../interface/playlist';
import { Video } from '../interface/video';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, AfterViewInit {

  AllPlaylistsTest: Playlist[] = [];
  videoList: Video[] = [];

  @BlockUI()
  blockUI!: NgBlockUI;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private authService: AuthService, 
    private message: MessageService, 
  ) { }
  ngAfterViewInit(): void {
    this.getVideoHistoryByUserId();
  }

  ngOnInit(): void {
    this.getVideoHistoryByUserId();
  }

  getVideoHistoryByUserId(): void{
    const request = {
      id_user: this.authService.userID,
    };
    this.blockUI.start('Loading...');
    this.message.sendMessage('history/getByUserId',request).subscribe((res:any) => {
      if (res.success){
        this.videoList = res.data.map((video: {channelId: string, channelTitle: string, channelUrl: string, description: string, publishedAt: Date | any, thumbnail: string, title: string, _id: string, videoId: string, videoUrl: string, }) => {
          return {
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
        if (res.errorSet.includes('RECORD_NOT_FOUND')) {
          this.toastrService.error('No record');
        }
        this.blockUI.stop();
      }
    },
    (err:any)=>{ 
      console.log(err); // message d'erreur
      this.blockUI.stop();
    })
    this.blockUI.stop();   
  }

  watchVideo(video: Video): void {
    const videoUrl = video.videoId;
    const url = "watch/" + videoUrl;
    this.router.navigateByUrl(url, { state: { video: video } });
  }

  clearHistory(): void {
    if (confirm("Are you sure you want to clear your history ? (this action is irreversible)")) {
      const request = {
        id_user: this.authService.userID,
      };
      this.blockUI.start('Loading...');
      this.message.sendMessage('history/deleteByIdUser',request).subscribe((res:any) => {
        if (res.success){
          this.toastrService.success('Clear history successfully');
          this.getVideoHistoryByUserId();
          this.blockUI.stop();
        }
        else{
          if (res.errorSet.includes('ERROR_DELETE_DATA')) {
            this.toastrService.error('Cannot delete history');
          }
          this.blockUI.stop();
        }
      },
      (err:any)=>{ 
        console.log(err); // message d'erreur
        this.blockUI.stop();
      })
      this.blockUI.stop(); 
    }
    
  }
}
