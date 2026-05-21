import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mx-auto grid max-w-6xl gap-5">
      <header>
        <h1 class="m-0 text-2xl font-bold leading-solid text-nav">Alertas de Inactividad</h1>
        <p class="mt-1 text-sm leading-default text-secondary">Seguimiento estático de pacientes que necesitan contacto clínico.</p>
      </header>

      <div class="grid gap-4 md:grid-cols-3">
        @for (item of summary; track item.label) {
          <article class="rounded-lg border border-line bg-surface p-5 shadow-sm">
            <p class="m-0 text-sm font-medium text-secondary">{{ item.label }}</p>
            <p class="mt-2 text-2xl font-bold leading-solid" [ngClass]="item.className">{{ item.value }}</p>
          </article>
        }
      </div>

      <div class="grid gap-4">
        @for (alert of alerts; track alert.name) {
          <article class="grid gap-4 rounded-lg border border-line bg-surface p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md md:grid-cols-[1fr_auto] md:items-center">
            <div class="flex min-w-0 items-center gap-4">
              <img class="h-14 w-14 rounded-full object-cover" [src]="alert.avatar" alt="" />
              <div class="min-w-0">
                <div class="mb-1 flex flex-wrap items-center gap-2">
                  <h2 class="m-0 text-base font-bold leading-solid text-main">{{ alert.name }}</h2>
                  <span class="rounded-full px-2 py-1 text-xs font-bold" [ngClass]="alert.levelClass">{{ alert.level }}</span>
                </div>
                <p class="m-0 text-sm text-secondary">{{ alert.message }}</p>
              </div>
            </div>
            <div class="flex flex-wrap justify-end gap-2">
              <button class="rounded-md border border-line px-4 py-2 text-sm font-bold text-secondary transition duration-200 hover:border-primary hover:text-primary">Ver expediente</button>
              <button class="rounded-md bg-primary px-4 py-2 text-sm font-bold text-white transition duration-200 hover:bg-primary/90">Contactar</button>
            </div>
          </article>
        }
      </div>
    </section>
  `,
})
export class AlertsComponent {
  summary = [
    { label: 'Alertas críticas', value: '2', className: 'text-danger' },
    { label: 'Seguimiento esta semana', value: '7', className: 'text-warning' },
    { label: 'Recuperados', value: '14', className: 'text-primary' },
  ];

  alerts = [
    { name: 'James Thornton', level: 'Crítico', levelClass: 'bg-danger-bg text-danger', message: '7 días sin actividad registrada en Rehabilitación Rodilla.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80' },
    { name: 'María Santos', level: 'Alto', levelClass: 'bg-warning/20 text-warning', message: '5 días sin completar rutina asignada para Lumbalgia Crónica.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=96&q=80' },
    { name: 'Roberto Díaz', level: 'Observación', levelClass: 'bg-info/10 text-info', message: 'Actividad irregular durante el último mes.', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=96&q=80' },
  ];
}
