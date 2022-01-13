import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Video } from '../interface/video';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss']
})
export class SearchListComponent implements OnInit {

  @Input() videos: Video[] = [];
  pageOfItems: Array<any> | undefined;
  
  constructor(private router: Router) { 
 }

  ngOnInit(): void {
  }

  watchVideo(video: Video){
    const videoUrl = video.videoId;
    const url = "watch/" + videoUrl;
    this.router.navigateByUrl(url, { state: { video: video } });
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
}
}
