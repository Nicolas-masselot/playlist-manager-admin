import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {MessageService, BackendData} from './message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  role: string | null = sessionStorage.getItem("role") ;
  userID: string | null = sessionStorage.getItem("UserID");
  LoggedIn: boolean = (this.userID !== null) ;
  userEmail: string | null = sessionStorage.getItem("mailUser");

  constructor(private service: MessageService) { }

  sendAuthentification(email: string , password: string): Observable<BackendData> {
    const requete = {
      email:email,
      password:password
    };
    this.userEmail = email ;
    return this.service.sendMessage('user/authenticate', requete); //url temporaire
  }

  finalizeAuthentification(reponse: BackendData): void {
    if (reponse.success){
      this.LoggedIn = true ;
      this.role = reponse.data.id_creator ;
      this.userID = reponse.data._id ;
      sessionStorage.setItem("UserID", String(this.userID));
      sessionStorage.setItem("role",String(this.role)) ; 
      sessionStorage.setItem("mailUser",String(this.userEmail))
    } else {
      this.LoggedIn = false ;
      this.role = null ;
    }
  }

  logOut(): void {
    this.userEmail = null;
    this.userID = null;
    this.LoggedIn = false;
    this.role = null;
    sessionStorage.clear();
  }
}
