import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth-guard-guard';

export const routes: Routes = [ 
    { path: 'login', component: LoginComponent }, 
    { 
        path: '', 
        canActivate: [AuthGuard], 
        loadComponent: () => import('./app-tabs/app-tabs').then(m => m.AppTabs)
    } 
];
