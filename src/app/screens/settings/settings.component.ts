import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <section class="mx-auto grid max-w-4xl gap-5">
      <header>
        <h1 class="m-0 text-2xl font-bold leading-solid text-nav">Configuraciones</h1>
        <p class="mt-1 text-sm leading-default text-secondary">Preferencias generales de la experiencia clínica.</p>
      </header>

      <article class="grid gap-5 rounded-lg border border-line bg-surface p-5 shadow-sm">
        <div class="grid gap-2">
          <h2 class="m-0 text-lg font-bold leading-solid text-main">Perfil profesional</h2>
          <p class="m-0 text-sm text-secondary">Esta vista es estática por ahora y replica la estructura visual del sistema.</p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <label class="grid gap-2 text-sm font-bold text-main">
            Nombre visible
            <input class="rounded-md border border-line bg-surface px-4 py-3 text-base outline-none focus:border-focus focus:ring-2 focus:ring-focus/20" value="Dra. Elena Ramos" />
          </label>
          <label class="grid gap-2 text-sm font-bold text-main">
            Especialidad
            <input class="rounded-md border border-line bg-surface px-4 py-3 text-base outline-none focus:border-focus focus:ring-2 focus:ring-focus/20" value="Fisioterapeuta" />
          </label>
          <label class="grid gap-2 text-sm font-bold text-main">
            Idioma
            <select class="rounded-md border border-line bg-surface px-4 py-3 text-base outline-none focus:border-focus focus:ring-2 focus:ring-focus/20">
              <option>Español</option>
              <option>English</option>
            </select>
          </label>
          <label class="grid gap-2 text-sm font-bold text-main">
            Zona horaria
            <select class="rounded-md border border-line bg-surface px-4 py-3 text-base outline-none focus:border-focus focus:ring-2 focus:ring-focus/20">
              <option>America/Mexico_City</option>
            </select>
          </label>
        </div>

        <div class="flex flex-wrap justify-end gap-3 border-t border-line pt-5">
          <button class="rounded-md border border-line px-4 py-3 text-sm font-bold text-secondary transition duration-200 hover:border-primary hover:text-primary">Cancelar</button>
          <button class="rounded-md bg-primary px-4 py-3 text-sm font-bold text-white transition duration-200 hover:bg-primary/90">Guardar cambios</button>
        </div>
      </article>
    </section>
  `,
})
export class SettingsComponent {}
