import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private httpClient:HttpClient) { }

  public getVideos(query: string): Observable <any> {
    const url = `${environment.YOUTUBE_URL}search?q=${query}&key=${environment.YOUTUBE_API_TOKEN}&part=snippet&type=video&maxResults=50`;
    return this.httpClient.get(url)
      .pipe(
        map((response: any) => response.items)
      );
  }

}