import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth-guard-guard';
import { AppTabs } from './app-tabs/app-tabs';

export const routes: Routes = [ 
    { path: 'login', component: LoginComponent }, 
    { 
        path: '',
        component:AppTabs ,
        canActivate: [AuthGuard], 
        //loadComponent: () => import('./app-tabs/app-tabs').then(m => m.AppTabs)
    } 
];
