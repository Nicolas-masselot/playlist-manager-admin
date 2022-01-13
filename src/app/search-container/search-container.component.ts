import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from 'src/environments/environment';
import { Video } from '../interface/video';
import { AuthService } from '../services/auth.service';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search-container',
  templateUrl: './search-container.component.html',
  styleUrls: ['./search-container.component.scss']
})
export class SearchContainerComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  
  userEmail: string | null = null;
  role: string | undefined;

  videos: Video[] = [];
  // inputTouched = false;
  // loading = false;

  constructor(private router: Router, private searchService: SearchService, private authService: AuthService) { 
    const navigation = this.router.getCurrentNavigation();
    const state = navigation!.extras.state as {searchInput: string};
    this.onSearch(state.searchInput);
 }

  ngOnInit(): void {
    this.userEmail = this.authService.userEmail;
    this.role = (this.authService.role === environment.ADMIN_ROLE) ? "admin" : (this.authService.role === environment.ADVERTISER_ROLE) ? "advertiser" : "user";
  }

  LogOut(): void {
    this.authService.logOut();
    this.router.navigate(['login']);
  }

  onSearch(searchInput: string): void {
    this.blockUI.start('Loading...');
    this.searchService.getVideos(searchInput)
      .subscribe((items: any) => {
        this.videos = items.map((item: { snippet: { title: any; channelId: any; channelTitle: any; description: any; publishedAt: string | number | Date; thumbnails: { high: { url: any; }; }; }; id: { videoId: any; }; }) => {
          return {
            title: item.snippet.title,
            videoId: item.id.videoId,
            videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            channelId: item.snippet.channelId,
            channelUrl: `https://www.youtube.com/channel/${item.snippet.channelId}`,
            channelTitle: item.snippet.channelTitle,
            description: item.snippet.description,
            publishedAt: new Date(item.snippet.publishedAt),
            thumbnail: item.snippet.thumbnails.high.url
          };
        });
        this.blockUI.stop();
      });
    this.blockUI.stop();
  }

}