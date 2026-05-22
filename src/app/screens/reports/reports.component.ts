import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RoleAccount } from '../../services/account-admin.service';
import { AuthService } from '../../services/auth.service';
import { ClinicalDataService } from '../../services/clinical-data.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="rw-page rw-page--narrow">
      <header class="rw-page-header">
        <div>
          <h1 class="rw-title">Generación de Reportes</h1>
          <p class="rw-subtitle">Reportes preparados únicamente con pacientes reales visibles para tu rol.</p>
        </div>
      </header>

      <article class="rw-card rw-card-pad">
        @if (loading()) {
          <p class="m-0 text-sm text-secondary">Cargando datos reales...</p>
        } @else {
          <div class="mb-6 flex items-center gap-4">
            <span class="grid h-12 w-12 place-items-center rounded-lg bg-info/10 text-info">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
            <div>
              <h2 class="m-0 text-lg font-bold leading-solid text-main">Exportación de Datos Clínicos</h2>
              <p class="m-0 text-sm text-secondary">{{ role() === 'paciente' ? 'Tu cuenta será usada como fuente del reporte.' : 'Selecciona un paciente real de tu directorio.' }}</p>
            </div>
          </div>

          <form class="grid gap-5">
            <label class="grid gap-2 text-xs font-bold uppercase tracking-wide text-secondary">
              Selección de paciente
              <select class="rounded-md border border-line bg-app px-4 py-3 text-sm font-medium normal-case tracking-normal text-main outline-none focus:border-focus focus:ring-2 focus:ring-focus/20" [disabled]="patients().length === 0">
                @for (patient of patients(); track patient.id) {
                  <option [value]="patient.id">{{ displayName(patient) }}</option>
                } @empty {
                  <option>No hay pacientes reales disponibles</option>
                }
              </select>
            </label>

            <div class="grid gap-5 sm:grid-cols-2">
              <label class="grid gap-2 text-xs font-bold uppercase tracking-wide text-secondary">
                Fecha de inicio
                <input class="rounded-md border border-line bg-app px-4 py-3 text-sm font-medium normal-case tracking-normal text-main outline-none focus:border-focus focus:ring-2 focus:ring-focus/20" type="date" />
              </label>
              <label class="grid gap-2 text-xs font-bold uppercase tracking-wide text-secondary">
                Fecha de fin
                <input class="rounded-md border border-line bg-app px-4 py-3 text-sm font-medium normal-case tracking-normal text-main outline-none focus:border-focus focus:ring-2 focus:ring-focus/20" type="date" />
              </label>
            </div>

            <div class="rounded-md border border-line bg-app p-4 text-sm text-secondary">
              Los botones de exportación quedan deshabilitados hasta que exista un endpoint real de reportes.
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <button class="rounded-lg border border-line bg-surface p-6 text-center opacity-60 shadow-sm" type="button" disabled>
                <strong class="block text-base font-bold text-main">Descargar Excel</strong>
                <span class="mt-1 block text-xs text-secondary">Pendiente de endpoint real</span>
              </button>
              <button class="rounded-lg border border-line bg-surface p-6 text-center opacity-60 shadow-sm" type="button" disabled>
                <strong class="block text-base font-bold text-main">Descargar PDF</strong>
                <span class="mt-1 block text-xs text-secondary">Pendiente de endpoint real</span>
              </button>
            </div>
          </form>
        }
      </article>
    </section>
  `,
})
export class ReportsComponent implements OnInit {
  private clinicalDataService = inject(ClinicalDataService);
  private authService = inject(AuthService);

  loading = signal(true);
  patients = signal<RoleAccount[]>([]);
  role = computed(() => this.authService.getRole() ?? 'paciente');

  ngOnInit(): void {
    this.clinicalDataService.visiblePatients().subscribe((patients) => {
      this.patients.set(patients);
      this.loading.set(false);
    });
  }

  displayName(account: RoleAccount): string {
    return this.clinicalDataService.displayName(account);
  }
}
