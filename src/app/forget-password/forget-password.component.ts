import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  containerClass: string[] = ['container'];

  constructor() { }

  ngOnInit(): void {
  }

  toggleRightPanel(value: boolean): void{
    if (value){
      this.containerClass.push('right-panel-active')
    }
    else{
      this.containerClass.pop()
    }
  }

}