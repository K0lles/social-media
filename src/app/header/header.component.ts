import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  async ngOnInit() {
    await this.authService.getUserInfo();
  }

  constructor(private authService: AuthService) {
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  get user(): any {
    if (this.authService.isAuthenticated) {
    return this.authService.user;
    }
  }
}
