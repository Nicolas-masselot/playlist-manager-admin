import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  userEmail: string | null = null;
  role: string | undefined;
  env = environment;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userEmail = this.authService.userEmail;
    this.role = (this.authService.role === environment.ADMIN_ROLE) ? "admin" : (this.authService.role === environment.ADVERTISER_ROLE) ? "advertiser" : "user";
  }

  LogOut(): void {
    this.authService.logOut();
    this.router.navigate(['login']);
  }

}
