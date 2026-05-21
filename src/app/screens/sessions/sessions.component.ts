import { Component } from '@angular/core';

@Component({
  selector: 'app-sessions',
  standalone: true,
  template: `
    <section class="mx-auto grid max-w-6xl gap-5">
      <header>
        <h1 class="m-0 text-2xl font-bold leading-solid text-nav">Historial de Sesiones</h1>
        <p class="mt-1 text-sm leading-default text-secondary">Esta sección no muestra datos simulados.</p>
      </header>

      <article class="rounded-lg border border-line bg-surface p-8 text-center shadow-sm">
        <div class="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-lg bg-line text-secondary">
          <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v6h6M12 7v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </div>
        <h2 class="m-0 text-lg font-bold text-main">Sin endpoint de sesiones conectado</h2>
        <p class="mx-auto mt-2 max-w-xl text-sm leading-default text-secondary">
          El backend actual expone cuentas, conversaciones, mensajes y videollamadas. Cuando exista un endpoint real de sesiones clínicas, esta vista puede conectarse sin usar información estática.
        </p>
      </article>
    </section>
  `,
})
export class SessionsComponent {}
