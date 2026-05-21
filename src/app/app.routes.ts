import { Routes } from '@angular/router';

import { MensajeriaComponent } from './screens/mensajeria/mensajeria.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'mensajeria' },
  //{ path: '', pathMatch: 'full', redirectTo: 'landing' },
  {
    path: 'mensajeria',
    component: MensajeriaComponent
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./screens/landing/landing').then((m) => m.LandingComponent),
  },
  { path: '**', redirectTo: 'landing' },
];
