import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mx-auto grid max-w-6xl gap-5">
      <header class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="m-0 text-2xl font-bold leading-solid text-nav">Comparativa de Desempeño</h1>
          <p class="mt-1 text-sm leading-default text-secondary">Análisis detallado de progreso clínico y contrastes.</p>
        </div>
        <div class="grid grid-cols-2 rounded-lg border border-line bg-surface p-1 shadow-sm">
          <button class="rounded-md bg-app px-4 py-2 text-sm font-bold text-main">Vista Individual</button>
          <button class="rounded-md px-4 py-2 text-sm font-bold text-secondary transition duration-200 hover:bg-app">Comparativa Grupal</button>
        </div>
      </header>

      <div class="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div class="grid gap-5">
          <article class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface p-4 shadow-sm">
            <div class="flex items-center gap-3">
              <img class="h-14 w-14 rounded-full object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80" alt="" />
              <div>
                <h2 class="m-0 text-base font-bold leading-solid text-main">Ana Silva</h2>
                <p class="m-0 text-sm text-secondary">Manguito Rotador (Fase 3)</p>
              </div>
            </div>
            <button class="rounded-md bg-primary-low px-4 py-2 text-sm font-bold text-primary transition duration-200 hover:bg-primary hover:text-white">Cambiar Paciente</button>
          </article>

          <article class="rounded-lg border border-line bg-surface p-5 shadow-sm">
            <h2 class="m-0 text-lg font-bold leading-solid text-main">Rango de Movimiento (ROM)</h2>
            <p class="mt-1 text-sm text-secondary">Comparación de grados alcanzados vs meta anatómica.</p>
            <div class="mt-8 grid gap-6">
              @for (bar of bars; track bar.label) {
                <div class="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center">
                  <span class="text-sm font-medium text-secondary">{{ bar.label }}</span>
                  <div class="h-6 rounded-full bg-app">
                    <div class="h-6 rounded-full bg-primary transition-all duration-400" [ngClass]="bar.width"></div>
                  </div>
                </div>
              }
            </div>
            <div class="mt-6 flex justify-center gap-5 text-xs text-secondary">
              <span class="flex items-center gap-2"><i class="h-3 w-3 rounded-full bg-line"></i> Meta (Grados)</span>
              <span class="flex items-center gap-2"><i class="h-3 w-3 rounded-full bg-primary"></i> Alcanzado</span>
            </div>
          </article>
        </div>

        <aside class="rounded-lg border border-line bg-surface p-5 shadow-sm">
          <div class="mb-6 flex items-center gap-3">
            <span class="grid h-10 w-10 place-items-center rounded-lg bg-primary-low text-primary">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
            <h2 class="m-0 text-lg font-bold leading-solid text-main">Score de Recuperación</h2>
          </div>
          <div class="grid place-items-center">
            <div class="relative grid h-44 w-44 place-items-center rounded-full bg-[conic-gradient(#00A781_0_85%,#E2E8F0_85%_100%)]">
              <div class="grid h-32 w-32 place-items-center rounded-full bg-surface text-center">
                <div>
                  <p class="m-0 text-2xl font-bold leading-solid text-main">85<span class="text-lg text-secondary">.2%</span></p>
                  <p class="m-0 text-xs font-bold text-primary">Mejorando</p>
                </div>
              </div>
            </div>
            <p class="mt-4 text-sm font-bold text-secondary">Índice Global Ponderado</p>
          </div>
          <dl class="mt-8 grid gap-3 rounded-lg bg-app p-4 text-sm">
            <div class="flex justify-between"><dt class="font-bold uppercase tracking-wide text-secondary">Fuerza muscular</dt><dd class="font-bold text-main">4/5</dd></div>
            <div class="flex justify-between"><dt class="font-bold uppercase tracking-wide text-secondary">Dolor (VAS)</dt><dd class="font-bold text-main">2/10</dd></div>
            <div class="flex justify-between"><dt class="font-bold uppercase tracking-wide text-secondary">Estabilidad</dt><dd class="font-bold text-primary">Excelente</dd></div>
          </dl>
        </aside>
      </div>
    </section>
  `,
})
export class PerformanceComponent {
  bars = [
    { label: 'Flexión Hombro', width: 'w-[88%]' },
    { label: 'Abducción', width: 'w-[82%]' },
    { label: 'Rotación Ext.', width: 'w-[45%]' },
    { label: 'Extensión', width: 'w-[28%]' },
  ];
}
