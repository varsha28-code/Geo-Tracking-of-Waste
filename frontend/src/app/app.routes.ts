import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StaffDashboard } from './staff-dashboard/staff-dashboard';
import { Login } from './login/login';
import { MyPointsComponent } from './my-points/my-points';
import { SettingsComponent } from './settings/settings';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: Login },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'staff-dashboard', component: StaffDashboard },
    { path: 'my-points', component: MyPointsComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '**', redirectTo: '' }
];
