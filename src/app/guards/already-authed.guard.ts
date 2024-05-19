import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const  alreadyAuthedGuard: CanActivateFn = async (route, state) => {
  let authService = inject(AuthService);
  if (authService.user) await inject(Router).navigate(['']);
  return true;
};
