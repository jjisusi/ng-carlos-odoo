import { Injectable } from '@angular/core';
declare const google: any;
@Injectable({ providedIn: 'root' })
export class AuthService {
  private storageKey = 'user';

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

    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  get currentUser() {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : null;
  }

  logout() {
    localStorage.removeItem(this.storageKey);
  }
}

