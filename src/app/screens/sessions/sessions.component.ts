import { Component } from '@angular/core';

@Component({
  selector: 'app-sessions',
  standalone: true,
  template: `
    <section class="rw-page">
      <header class="rw-page-header">
        <div>
          <h1 class="rw-title">Historial de Sesiones</h1>
          <p class="rw-subtitle">Esta sección no muestra datos simulados.</p>
        </div>
        <button class="rw-action bg-nav text-white" type="button" disabled>
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          Ver Reporte Completo
        </button>
      </header>

      <article class="rw-card">
        <div class="rw-toolbar border-b border-line">
          <label class="rw-field text-sm">
            <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
            <input placeholder="Buscar por ID, paciente o programa..." disabled />
          </label>
          <button class="rw-action" type="button" disabled>
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
            Filtros Avanzados
          </button>
        </div>

        <div class="p-8 text-center">
          <div class="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-lg bg-line text-secondary">
            <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v6h6M12 7v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </div>
          <h2 class="m-0 text-lg font-bold text-main">Sin endpoint de sesiones conectado</h2>
          <p class="mx-auto mt-2 max-w-xl text-sm leading-default text-secondary">
            El backend actual expone cuentas, conversaciones, mensajes y videollamadas. Cuando exista un endpoint real de sesiones clínicas, esta vista puede conectarse sin usar información estática.
          </p>
        </div>
      </article>
    </section>
  `,
})
export class SessionsComponent {}
