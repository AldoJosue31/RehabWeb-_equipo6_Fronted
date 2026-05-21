import { Routes } from '@angular/router';

import { MensajeriaComponent } from './screens/mensajeria/mensajeria.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'mensajeria' },
  {
    path: 'login',
    loadComponent: () =>
      import('./screens/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'mensajeria',
    component: MensajeriaComponent,
    canActivate: [authGuard],
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./screens/landing/landing').then((m) => m.LandingComponent),
  },
  { path: '**', redirectTo: 'login' },
];
