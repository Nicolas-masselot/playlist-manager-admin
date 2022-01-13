import { PlaylistCreateComponent } from '../playlist-create/playlist-create.component';
import { Playlist } from '../interface/playlist';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

export interface Playlists{
  nom:string,
  description:string
}

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.component.html',
  styleUrls: ['./dashboard-user.component.scss']
})

export class DashboardUserComponent implements OnInit {

  AllPlaylists: Playlist[] = [];

  @BlockUI()
  blockUI!: NgBlockUI;

  constructor(private message: MessageService, 
    private newPlaylistModalService: NgbModal ,
    private router: Router,
    private toastrService: ToastrService,
    private authService: AuthService
    ) { }

  ngOnInit(): void {
    this.getAllPlaylist();
  }

  createPlaylist():void{
    const modalRef = this.newPlaylistModalService.open(PlaylistCreateComponent);
		modalRef.result.then((result:any) => {
			this.getAllPlaylist();
		// console.log(`Closed with: ${result}`);
		}, (reason:any) => {
			this.getAllPlaylist();
		// console.log(`Dismissed ${this.getDismissReason(reason)}`);
		});
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
      (err:any)=>{ 
        console.log(err); // message d'erreur
        this.blockUI.stop();
      }
    ) ;
    this.blockUI.stop();
  }

  openPlaylist(playlistId: string){
    const url = "playlist/" + playlistId;
    this.router.navigateByUrl(url);
  }
}