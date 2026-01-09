import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}


  ngOnInit() {
    this.auth.initGoogleLogin(() => {
      // Cuando Google devuelve el token, redirigimos
      this.router.navigate(['/']);
    });

    this.auth.renderButton('googleBtn');
  }
}
