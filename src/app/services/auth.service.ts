import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storageKey = 'user';

  // Lista blanca temporal en cliente
  private allowedEmails = [
    'carvi65@gmail.com',
    'jjisusi@gmail.com'
  ];

  constructor(private router: Router) {}

  initGoogleLogin(callback: () => void) {
    google.accounts.id.initialize({
      client_id: '210393336032-9urvcp1l2ko3qohd07th4hqclfur7hvn.apps.googleusercontent.com',
      callback: (response: any) => {
        this.handleCredential(response);
        callback();
      }
    });
  }

  renderButton(elementId: string) {
    google.accounts.id.renderButton(
      document.getElementById(elementId)!,
      { theme: 'outline', size: 'large' }
    );
  }

  private handleCredential(response: any) {
    const token = response.credential;
    const payload = JSON.parse(atob(token.split('.')[1]));

    const user = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      token
    };

    // Guardar usuario
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  get currentUser() {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : null;
  }

  // Lista blanca en cliente
  isAllowed(): boolean {
    const user = this.currentUser;
    return user && this.allowedEmails.includes(user.email);
  }

  logout() {
    google.accounts.id.disableAutoSelect();
    localStorage.removeItem(this.storageKey);
    this.router.navigate(['/login']);
  }
}
