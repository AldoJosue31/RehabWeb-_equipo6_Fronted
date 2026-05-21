import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mx-auto grid max-w-6xl gap-5">
      <header class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="m-0 text-2xl font-bold leading-solid text-nav">Historial de Sesiones</h1>
          <p class="mt-1 text-sm leading-default text-secondary">Registro detallado de intervenciones clínicas.</p>
        </div>
        <button class="flex items-center gap-2 rounded-md bg-nav px-5 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-nav/90">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          Ver Reporte Completo
        </button>
      </header>

      <article class="overflow-hidden rounded-lg border border-line bg-surface shadow-sm">
        <div class="grid gap-3 border-b border-line p-4 md:grid-cols-[1fr_auto]">
          <label class="flex items-center gap-3 rounded-md border border-line bg-surface px-4 py-3 text-sm text-secondary shadow-sm focus-within:border-focus focus-within:ring-2 focus-within:ring-focus/20">
            <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
            <input class="w-full bg-transparent outline-none placeholder:text-muted" placeholder="Buscar por ID, paciente o programa..." />
          </label>
          <button class="flex items-center justify-center gap-2 rounded-md border border-line bg-surface px-4 py-3 text-sm font-bold text-secondary shadow-sm transition duration-200 hover:border-primary hover:text-primary">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 5h18l-7 8v5l-4 2v-7L3 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            Filtros Avanzados
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full min-w-[860px] text-left text-sm">
            <thead class="border-b border-line bg-app text-xs font-bold uppercase tracking-wide text-muted">
              <tr>
                <th class="px-5 py-4">ID Sesión</th>
                <th class="px-5 py-4">Fecha</th>
                <th class="px-5 py-4">Paciente</th>
                <th class="px-5 py-4">Programa</th>
                <th class="px-5 py-4">Duración</th>
                <th class="px-5 py-4">Score</th>
                <th class="px-5 py-4">Estado</th>
                <th class="px-5 py-4 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-line">
              @for (session of sessions; track session.id) {
                <tr class="transition duration-200 hover:bg-app">
                  <td class="px-5 py-4 font-bold text-main">{{ session.id }}</td>
                  <td class="px-5 py-4 text-secondary">{{ session.date }}</td>
                  <td class="px-5 py-4 font-bold text-main">{{ session.patient }}</td>
                  <td class="px-5 py-4 text-secondary">{{ session.program }}</td>
                  <td class="px-5 py-4 text-secondary">{{ session.duration }}</td>
                  <td class="px-5 py-4 font-bold text-main">{{ session.score }}</td>
                  <td class="px-5 py-4">
                    <span class="rounded-full px-3 py-1 text-xs font-bold" [ngClass]="session.statusClass">{{ session.status }}</span>
                  </td>
                  <td class="px-5 py-4 text-right">
                    <button class="rounded-full border border-line px-3 py-1 text-xs font-bold text-secondary transition duration-200 hover:border-primary hover:text-primary">Ver Sesión</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <footer class="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4 text-sm text-secondary">
          <span>Mostrando <strong class="text-main">1 a 6</strong> de <strong class="text-main">8</strong> registros</span>
          <div class="flex items-center gap-3">
            <button class="grid h-9 w-9 place-items-center rounded-full border border-line text-secondary transition duration-200 hover:border-primary hover:text-primary">‹</button>
            <span class="font-bold text-main">Página 1 de 2</span>
            <button class="grid h-9 w-9 place-items-center rounded-full border border-line text-secondary transition duration-200 hover:border-primary hover:text-primary">›</button>
          </div>
        </footer>
      </article>
    </section>
  `,
})
export class SessionsComponent {
  sessions = [
    { id: 'S-1090', date: '28 Nov 2023, 09:30', patient: 'Ana Silva', program: 'Manguito Rotador', duration: '45 min', score: 85, status: 'Excelente', statusClass: 'bg-primary-low text-primary' },
    { id: 'S-1089', date: '27 Nov 2023, 16:00', patient: 'Carlos Ruiz', program: 'Rodilla Fase 2', duration: '30 min', score: 45, status: 'Regular', statusClass: 'bg-warning/20 text-warning' },
    { id: 'S-1088', date: '26 Nov 2023, 11:15', patient: 'Javier Gómez', program: 'Fuerza Lumbar', duration: '50 min', score: 92, status: 'Excelente', statusClass: 'bg-primary-low text-primary' },
    { id: 'S-1087', date: '25 Nov 2023, 14:00', patient: 'Sofía Castro', program: 'Post-operatorio Tobillo', duration: '40 min', score: 78, status: 'Bueno', statusClass: 'bg-info/10 text-info' },
    { id: 'S-1086', date: '24 Nov 2023, 10:00', patient: 'Miguel Torres', program: 'Estiramiento Cervical', duration: '35 min', score: 65, status: 'Bueno', statusClass: 'bg-info/10 text-info' },
    { id: 'S-1085', date: '23 Nov 2023, 15:30', patient: 'Ana Silva', program: 'Manguito Rotador', duration: '45 min', score: 80, status: 'Bueno', statusClass: 'bg-info/10 text-info' },
  ];
}
