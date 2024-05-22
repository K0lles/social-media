import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";


export const authGuard: CanActivateFn = async (route, state) => {
  let authService = inject(AuthService);
  if (!authService.user) await inject(Router).navigate(['/login']);
  return true;
};