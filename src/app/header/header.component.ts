import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  async ngOnInit() {
    // await this.authService.getUserInfo();
  }

  constructor(private authService: AuthService, private router: Router) {
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  get user(): any {
    return this.authService.user;
  }

  async logout() {

    await this.router.navigate(['/login']);
  }
}
