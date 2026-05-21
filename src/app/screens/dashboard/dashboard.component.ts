import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mx-auto grid max-w-6xl gap-5">
      <header class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="m-0 text-2xl font-bold leading-solid text-nav">Tablero de Control</h1>
          <p class="mt-1 text-sm leading-default text-secondary">Resumen general de evolución clínica y alertas del día.</p>
        </div>
        <button class="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-primary/90">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h4l2-6 4 12 2-6h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          Nueva sesión
        </button>
      </header>

      <article class="rounded-lg border border-warning bg-warning/10 p-4 shadow-sm">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="grid h-10 w-10 place-items-center rounded-lg bg-warning/20 text-warning">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 9 0 4M12 17h.01M10.3 4.2 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
            <div>
              <h2 class="m-0 text-base font-bold leading-solid text-warning">Alerta de Inactividad de Pacientes</h2>
              <p class="m-0 text-sm text-secondary">2 pacientes requieren atención inmediata por abandono del plan.</p>
            </div>
          </div>
          <button class="rounded-full border border-warning bg-surface px-4 py-2 text-sm font-bold text-warning transition duration-200 hover:bg-warning hover:text-white">Ver todos (2)</button>
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          @for (alert of alerts; track alert.name) {
            <div class="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div class="flex min-w-0 items-center gap-3">
                <img class="h-12 w-12 rounded-full object-cover" [src]="alert.avatar" alt="" />
                <div class="min-w-0">
                  <p class="m-0 truncate text-sm font-bold text-main">{{ alert.name }}</p>
                  <p class="m-0 text-xs text-secondary">{{ alert.program }}</p>
                </div>
              </div>
              <span class="rounded-full bg-danger px-2 py-1 text-xs font-bold text-white">{{ alert.days }}d</span>
            </div>
          }
        </div>
      </article>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        @for (metric of metrics; track metric.label) {
          <article class="rounded-lg border border-line bg-surface p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div class="mb-4 flex items-center justify-between">
              <span class="grid h-11 w-11 place-items-center rounded-lg" [ngClass]="metric.iconBg">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path [attr.d]="metric.path" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              <span class="rounded-full px-2 py-1 text-xs font-bold" [ngClass]="metric.deltaClass">{{ metric.delta }}</span>
            </div>
            <p class="m-0 text-sm font-medium text-secondary">{{ metric.label }}</p>
            <p class="mt-2 text-2xl font-bold leading-solid text-main">{{ metric.value }}</p>
          </article>
        }
      </div>

      <article class="rounded-lg border border-line bg-surface p-5 shadow-sm">
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="m-0 text-lg font-bold leading-solid text-main">Evolución de Movilidad (Promedio Global)</h2>
            <p class="mt-1 text-sm text-secondary">Progreso histórico del tratamiento en la clínica.</p>
          </div>
          <select class="rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-secondary outline-none focus:border-focus focus:ring-2 focus:ring-focus/20">
            <option>Último mes</option>
            <option>Último trimestre</option>
          </select>
        </div>
        <div class="h-[280px] overflow-hidden rounded-md bg-app p-4">
          <svg class="h-full w-full" viewBox="0 0 900 260" preserveAspectRatio="none" aria-label="Grafica de movilidad">
            <g class="text-line">
              <path d="M30 40H870M30 95H870M30 150H870M30 205H870" stroke="currentColor" stroke-width="1" stroke-dasharray="4 8" />
            </g>
            <path d="M30 220 C120 198 160 198 220 205 S330 195 390 155 S520 140 580 148 S690 112 760 92 S840 72 870 66" fill="none" stroke="#00A781" stroke-width="5" stroke-linecap="round" />
            <g fill="#00A781" stroke="#fff" stroke-width="4">
              <circle cx="30" cy="220" r="6" /><circle cx="170" cy="202" r="6" /><circle cx="310" cy="206" r="6" /><circle cx="410" cy="158" r="6" /><circle cx="520" cy="145" r="6" /><circle cx="630" cy="150" r="6" /><circle cx="740" cy="104" r="6" /><circle cx="850" cy="70" r="6" />
            </g>
            <circle cx="630" cy="150" r="6" fill="#FF5C5C" stroke="#fff" stroke-width="4" />
          </svg>
        </div>
      </article>
    </section>
  `,
})
export class DashboardComponent {
  alerts = [
    {
      name: 'James Thornton',
      program: 'Rehabilitación Rodilla',
      days: 7,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80',
    },
    {
      name: 'María Santos',
      program: 'Lumbalgia Crónica',
      days: 5,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=96&q=80',
    },
  ];

  metrics = [
    { label: 'Tasa de cumplimiento', value: '88%', delta: '+5%', deltaClass: 'bg-primary-low text-primary', iconBg: 'bg-primary-low text-primary', path: 'M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z' },
    { label: 'Días activos', value: '14', delta: 'Este mes', deltaClass: 'bg-primary-low text-primary', iconBg: 'bg-info/10 text-info', path: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z' },
    { label: 'Duración promedio', value: '35m', delta: '-2m', deltaClass: 'bg-danger-bg text-danger', iconBg: 'bg-warning/20 text-warning', path: 'M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
    { label: 'Score de dolor', value: '3/10', delta: '-1 pt', deltaClass: 'bg-primary-low text-primary', iconBg: 'bg-primary-low text-primary', path: 'M4 12h4l2-6 4 12 2-6h4' },
  ];
}
