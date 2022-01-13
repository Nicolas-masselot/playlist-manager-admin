import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss']
})
export class ConfirmDeleteDialogComponent implements OnInit {

  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"

  constructor( @Inject(MAT_DIALOG_DATA) private data: any,private dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>) {
    if (data) {
      this.message = data.message;
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.deleteconfirmed;
        this.cancelButtonText = data.buttonText.canceldelete;
      }
    }
   }

  ngOnInit(): void {
  }

  onClickDelete(): void {
    this.dialogRef.close(true) ;
  }

}
