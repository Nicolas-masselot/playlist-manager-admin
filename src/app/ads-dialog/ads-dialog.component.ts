import { Component, Inject, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ads-dialog',
  templateUrl: './ads-dialog.component.html',
  styleUrls: ['./ads-dialog.component.scss']
})
export class AdsDialogComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  env = environment ;
  dialogType = "addAdvert";
  adName:string = "";
  AdvertID:string | undefined ;
  titleMessage:string = "Add new Advertisement";
  SavebuttonText:string = "Save changes" ;
  advertiserMail:string = "";
  accountRole:string = environment.ADMIN_ROLE;
  nameRequired:boolean = false ;
  advertInputClass:string = "AdvertInputs";
  fileInputClass:string = "AdvertInputs";
  FileTypeIncorrect:boolean = false ;
  FileRequired:boolean = false ;
  labelFileText:string = "Choose a file";

  //"mp4","ogg","mpg","webm"
  FileTypes:string[] = ["jpg","png","jpeg"];

  advertFile:File | undefined = undefined ;
  FileSizeIncorrect: boolean = false;
  
  constructor(@Inject(MAT_DIALOG_DATA) private data: any
  ,private dialogRef: MatDialogRef<AdsDialogComponent>
  ,private service:MessageService, private authServ:AuthService ) { 
    this.dialogType = data.dialogType ;
    if (data.AdvertID) {
      this.AdvertID = data.AdvertID ;
    }

    if (data.advertiserMail) {
      this.advertiserMail = data.advertiserMail ;
    }

    if (data.adName) {
      this.adName = data.adName
    }

    if (data.filename) {
      this.labelFileText = data.filename;
    }

    if ( this.dialogType === 'editAds' ) {
      this.titleMessage = "Edit advertisement";
      this.SavebuttonText = "Save changes";
    } else {
      this.titleMessage = "Add a new advertisement";
      this.SavebuttonText = "Add the advertisement" ;
    }

    //this.accountRole = authServ.role ;
  }

  ngOnInit(): void {
  }


  onFileSelected(event: Event | any) {
    if(event.target.files.length > 0) {
      this.labelFileText = event.target.files[0].name ;
      const uploadedVideoType:string = event.target.files[0].type; 
      
      if (!this.FileTypes.includes(uploadedVideoType.replace('image/',''))) {
        this.FileTypeIncorrect = true ;
        this.FileRequired = false ;
        this.fileInputClass = "AdvertInputsError";
      } else if (event.target.files[0].size > 5000000) {
        this.FileSizeIncorrect = true ;
        this.FileRequired = false ;
        this.fileInputClass = "AdvertInputsError";
      } else {
        this.FileTypeIncorrect = false ;
        this.FileRequired = false ;
        this.fileInputClass = "AdvertInputs";
        this.advertFile = event.target.files[0];
        console.log(this.advertFile) ;
      }
    } 
  }

  OnSaveData():void {

    if ( this.advertFile == undefined && this.dialogType === 'addAdvert' && !this.FileTypeIncorrect ) {
      this.FileRequired = true ;
    } else {
      this.FileRequired = false ;
    }

    if ( this.FileTypeIncorrect || this.FileRequired ) {
      this.fileInputClass = "AdvertInputsError" ;
    } else {
      this.fileInputClass = "AdvertInputs" ;
    }

    if ( this.dialogType === 'editAds') {
      this.dialogRef.close({idAd:this.AdvertID, changed:true,FileAdvert:this.advertFile});
    } else if ( !this.FileRequired && !this.FileTypeIncorrect && this.dialogType=== 'addAdvert') {
      this.dialogRef.close({FileAdvert:this.advertFile});
    }
  }
}
