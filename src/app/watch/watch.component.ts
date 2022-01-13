import { VideoSaveComponent } from './../video-save/video-save.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Video } from '../interface/video';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent implements OnInit {
  videoId: string = "";
  video: Video | any;

  adsImg: any;

  @BlockUI()
  blockUI!: NgBlockUI;

  constructor(private route: ActivatedRoute, 
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService, 
    private message: MessageService, 
    private toastrService: ToastrService,
    private domSanitizer: DomSanitizer
    ) { 
      const navigation = this.router.getCurrentNavigation();
      const state = navigation!.extras.state as {video: Video};
      this.video = state.video;
  }

  ngOnInit(): void {
    this.videoId = this.route.snapshot.params["id"];
    this.saveVideoToHistory();
    this.getAds();
  }

  saveVideo(): void {
    const dialogRef = this.dialog.open(VideoSaveComponent, {
      data: {video: this.video},
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }

  saveVideoToHistory():void {
    const request = {
      videoId: this.video.videoId,
      videoUrl: this.video.videoUrl,
      title: this.video.title,
      channelId: this.video.channelId,
      channelUrl: this.video.channelUrl,
      channelTitle: this.video.channelTitle,
      description: this.video.description,
      publishedAt: this.video.publishedAt,
      thumbnail: this.video.thumbnail,
      playlists: this.video.playlists,
      id_user: this.authService.userID,
  };
    this.blockUI.start('Loading...');
    this.message.sendMessage('history/createLog',request).subscribe(
      (res:any) => {
      if (res.success){
        this.toastrService.success('Save video to history');
      }else{
        if (res.errorSet.includes('CANNOT_CREATE_DATA')) {
          this.toastrService.error('Cannot save video to history');
        }
      }
      this.blockUI.stop();
    },
    (err:any)=>{ 
      console.log(err); // message d'erreur
      this.blockUI.stop();
    })
    this.blockUI.stop();
  }

  getAds(): void {
    console.log("Get ads")
    this.blockUI.start('Loading...');
    const request = {}
    this.message.sendMessage('annonceur/getRandom',request).subscribe(
      (res:any) => {
        console.log(res);
        const adsImgUrl = "http://127.0.0.1:3000/" + res.fileName;
        this.adsImg  = this.domSanitizer.bypassSecurityTrustUrl(adsImgUrl);
        console.log(this.adsImg);
        // this.toastrService.success('Get ads');
        this.blockUI.stop();
      },
    (err:any)=>{ 
      console.log(err); // message d'erreur
      this.blockUI.stop();
    })
    this.blockUI.stop();
  }
}
