import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.auth.currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!this.auth.isAllowed()) {
      this.router.navigate(['/no-autorizado']);
      return false;
    }

    return true;
  }
}


