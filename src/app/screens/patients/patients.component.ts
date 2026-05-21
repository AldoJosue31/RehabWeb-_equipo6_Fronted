import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mx-auto grid max-w-6xl gap-5">
      <header class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="m-0 text-2xl font-bold leading-solid text-nav">Directorio de Pacientes</h1>
          <p class="mt-1 text-sm leading-default text-secondary">Gestión y monitoreo de todos los perfiles clínicos vinculados.</p>
        </div>
        <button class="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-primary/90">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M19 8v6M22 11h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          Asociar Nuevo Paciente
        </button>
      </header>

      <div class="grid gap-3 rounded-lg border border-line bg-surface p-4 shadow-sm md:grid-cols-[1fr_auto]">
        <label class="flex items-center gap-3 rounded-md border border-line bg-app px-4 py-3 text-sm text-secondary focus-within:border-focus focus-within:ring-2 focus-within:ring-focus/20">
          <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
          <input class="w-full bg-transparent outline-none placeholder:text-muted" placeholder="Buscar por nombre, ID o diagnóstico..." />
        </label>
        <button class="flex items-center justify-center gap-2 rounded-md border border-line bg-surface px-4 py-3 text-sm font-bold text-secondary transition duration-200 hover:border-primary hover:text-primary">
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 5h18l-7 8v5l-4 2v-7L3 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          Filtros
        </button>
      </div>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        @for (patient of patients; track patient.id) {
          <article class="rounded-lg border border-line bg-surface p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div class="mb-4 h-1 rounded-full" [ngClass]="patient.risk === 'Riesgo' ? 'bg-danger' : patient.risk === 'Alta' ? 'bg-muted' : 'bg-primary'"></div>
            <div class="mb-5 flex items-start justify-between gap-3">
              <div class="flex min-w-0 items-center gap-3">
                <img class="h-14 w-14 rounded-full object-cover" [src]="patient.avatar" alt="" />
                <div class="min-w-0">
                  <h2 class="m-0 truncate text-base font-bold leading-solid text-main">{{ patient.name }}</h2>
                  <p class="mt-1 text-xs text-secondary">P-{{ patient.id }}</p>
                </div>
              </div>
              <button class="rounded-full px-2 py-1 text-secondary transition duration-200 hover:bg-app hover:text-primary" aria-label="Mas opciones">
                <span class="block text-lg leading-none">...</span>
              </button>
            </div>

            <div class="border-t border-line pt-4">
              <p class="m-0 text-xs font-bold uppercase tracking-wide text-muted">Diagnóstico principal</p>
              <p class="mt-2 text-sm font-bold text-main">{{ patient.diagnosis }}</p>
            </div>

            <footer class="mt-5 flex items-center justify-between gap-3">
              <span class="flex items-center gap-2 text-xs text-secondary">
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                {{ patient.lastSeen }}
              </span>
              <span class="rounded-md px-3 py-1 text-xs font-bold" [ngClass]="patient.risk === 'Riesgo' ? 'bg-danger-bg text-danger' : patient.risk === 'Alta' ? 'bg-line text-secondary' : 'bg-primary-low text-primary'">
                {{ patient.risk }}
              </span>
            </footer>
          </article>
        }
      </div>
    </section>
  `,
})
export class PatientsComponent {
  patients = [
    { id: '10042', name: 'Carlos Ruiz', diagnosis: 'Rehabilitación Rodilla (LCA)', lastSeen: 'Ayer, 11:15 AM', risk: 'Riesgo', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=96&q=80' },
    { id: '10087', name: 'Ana Silva', diagnosis: 'Manguito Rotador', lastSeen: 'Hoy, 09:30 AM', risk: 'Activo', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80' },
    { id: '10103', name: 'Javier Gómez', diagnosis: 'Lumbalgia Crónica', lastSeen: 'Hace 2 días', risk: 'Activo', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&q=80' },
    { id: '10211', name: 'María Santos', diagnosis: 'Post-operatorio Cadera', lastSeen: 'Hace 5 días', risk: 'Riesgo', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=96&q=80' },
    { id: '10255', name: 'Roberto Díaz', diagnosis: 'Esguince Tobillo G3', lastSeen: 'Hace 1 mes', risk: 'Alta', avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=96&q=80' },
  ];
}
