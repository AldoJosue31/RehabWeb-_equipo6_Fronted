import { Routes } from '@angular/router';

import { AppShellComponent } from './layout/app-shell.component';
import { MensajeriaComponent } from './screens/mensajeria/mensajeria.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tablero-control' },
  {
    path: 'login',
    loadComponent: () =>
      import('./screens/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'tablero-control',
        loadComponent: () =>
          import('./screens/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'pacientes',
        loadComponent: () =>
          import('./screens/patients/patients.component').then((m) => m.PatientsComponent),
      },
      {
        path: 'historial-sesiones',
        loadComponent: () =>
          import('./screens/sessions/sessions.component').then((m) => m.SessionsComponent),
      },
      {
        path: 'comparativa-desempeno',
        loadComponent: () =>
          import('./screens/performance/performance.component').then((m) => m.PerformanceComponent),
      },
      {
        path: 'alertas-inactividad',
        loadComponent: () =>
          import('./screens/alerts/alerts.component').then((m) => m.AlertsComponent),
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./screens/reports/reports.component').then((m) => m.ReportsComponent),
      },
      {
        path: 'mensajeria',
        component: MensajeriaComponent,
      },
      {
        path: 'configuraciones',
        loadComponent: () =>
          import('./screens/settings/settings.component').then((m) => m.SettingsComponent),
      },
    ],
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./screens/landing/landing').then((m) => m.LandingComponent),
  },
  { path: '**', redirectTo: 'login' },
];
