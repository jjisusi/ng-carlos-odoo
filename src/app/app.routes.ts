import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.componet';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth-guard-guard';

export const routes: Routes = [
    { 
        path: 'login', 
        component: LoginComponent 
    }, 
    { 
        path: '', 
        component: AppComponent, 
        // canActivate: [AuthGuard] 
    }
];
