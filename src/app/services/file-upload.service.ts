import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = environment.server;

  constructor(private http: HttpClient) { }

  sendAdFile(Url:string,file: File,idAdvertiser:string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file, idAdvertiser+'_'+file.name);

    const req = new HttpRequest('POST', `${this.baseUrl}${Url}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(path:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${path}`);
  }
}