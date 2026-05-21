import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mx-auto grid max-w-4xl gap-5">
      <header>
        <h1 class="m-0 text-2xl font-bold leading-solid text-nav">Generación de Reportes</h1>
        <p class="mt-1 text-sm leading-default text-secondary">Exportación de datos clínicos para análisis y respaldo.</p>
      </header>

      <article class="rounded-lg border border-line bg-surface p-5 shadow-sm">
        <div class="mb-6 flex items-center gap-4">
          <span class="grid h-12 w-12 place-items-center rounded-lg bg-info/10 text-info">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </span>
          <div>
            <h2 class="m-0 text-lg font-bold leading-solid text-main">Exportación de Datos Clínicos</h2>
            <p class="m-0 text-sm text-secondary">Genera reportes técnicos y comparativos para la historia clínica.</p>
          </div>
        </div>

        <form class="grid gap-5">
          <label class="grid gap-2 text-xs font-bold uppercase tracking-wide text-secondary">
            Selección de paciente
            <select class="rounded-md border border-line bg-surface px-4 py-3 text-sm font-medium normal-case tracking-normal text-main outline-none focus:border-focus focus:ring-2 focus:ring-focus/20">
              <option>Todos los pacientes</option>
              <option>Ana Silva</option>
              <option>Carlos Ruiz</option>
            </select>
          </label>

          <div class="grid gap-5 sm:grid-cols-2">
            <label class="grid gap-2 text-xs font-bold uppercase tracking-wide text-secondary">
              Fecha de inicio
              <input class="rounded-md border border-line bg-surface px-4 py-3 text-sm font-medium normal-case tracking-normal text-main outline-none focus:border-focus focus:ring-2 focus:ring-focus/20" type="date" />
            </label>
            <label class="grid gap-2 text-xs font-bold uppercase tracking-wide text-secondary">
              Fecha de fin
              <input class="rounded-md border border-line bg-surface px-4 py-3 text-sm font-medium normal-case tracking-normal text-main outline-none focus:border-focus focus:ring-2 focus:ring-focus/20" type="date" />
            </label>
          </div>

          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <button class="group rounded-lg border border-line bg-surface p-6 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-info hover:shadow-md" type="button">
              <span class="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-lg bg-app text-secondary transition duration-200 group-hover:bg-info/10 group-hover:text-info">
                <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8M8 9h2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              <strong class="block text-base font-bold text-main">Descargar Excel</strong>
              <span class="mt-1 block text-xs text-secondary">Datos crudos en formato tabular</span>
            </button>

            <button class="group relative rounded-lg border border-danger/30 bg-surface p-6 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-danger hover:shadow-md" type="button">
              <span class="absolute right-4 top-4 rounded-full bg-danger-bg px-2 py-1 text-xs font-bold text-danger">JWT Req.</span>
              <span class="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-lg bg-danger-bg text-danger">
                <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </span>
              <strong class="block text-base font-bold text-danger">Descargar PDF</strong>
              <span class="mt-1 block text-xs text-secondary">Documento formal con gráficas</span>
            </button>
          </div>
        </form>
      </article>
    </section>
  `,
})
export class ReportsComponent {}
