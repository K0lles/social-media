import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {map, Observable, of, startWith} from "rxjs";
import {MatAutocomplete} from "@angular/material/autocomplete";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('auto') autoComplete: MatAutocomplete | undefined;

  userControl: FormControl<string> = new FormControl();
  users: any[] = [
    { username: 'kostya', id: 23, image: ''},
    { username: 'yura', id: 34, image: ''},
    { username: 'andrei', id: 3, image: ''},
    { username: 'Lesyk', id: 2, image: ''},
  ]

  filteredUsers: Observable<any[]> | undefined;

  async ngOnInit() {
    this.filteredUsers = of(this.users);
    // await this.authService.getUserInfo();
    this.filteredUsers = this.userControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.username;

        return value ? this._filter(name) : this.users.slice();
      }),
    );
  }

  displayFn(user: any): string {
    return user && user.username ? user.username : '';
  }

  selectUser(user: any) {
    this.userControl.setValue('')
    void this.router.navigate(['user', user.id]);
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.users.filter(user => user.username.toLowerCase().includes(filterValue));
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
    await this.authService.logout();
  }
}
