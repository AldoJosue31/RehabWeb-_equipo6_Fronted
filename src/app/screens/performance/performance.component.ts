import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RoleAccount } from '../../services/account-admin.service';
import { ClinicalDataService } from '../../services/clinical-data.service';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mx-auto grid max-w-6xl gap-5">
      <header>
        <h1 class="m-0 text-2xl font-bold leading-solid text-nav">Comparativa de Desempeño</h1>
        <p class="mt-1 text-sm leading-default text-secondary">Vista basada solo en perfiles clínicos reales disponibles.</p>
      </header>

      @if (loading()) {
        <div class="rounded-lg border border-line bg-surface p-6 text-sm text-secondary shadow-sm">Cargando pacientes...</div>
      } @else {
        <div class="grid gap-5 xl:grid-cols-[320px_1fr]">
          <aside class="rounded-lg border border-line bg-surface p-4 shadow-sm">
            <h2 class="m-0 mb-3 text-base font-bold text-main">Pacientes reales</h2>
            <div class="grid gap-2">
              @for (patient of patients(); track patient.id) {
                <button
                  class="rounded-md border p-3 text-left transition duration-200 hover:border-primary hover:bg-primary-low"
                  [ngClass]="selectedPatient()?.id === patient.id ? 'border-primary bg-primary-low text-primary' : 'border-line bg-surface text-main'"
                  type="button"
                  (click)="selectedPatient.set(patient)"
                >
                  <strong class="block text-sm">{{ displayName(patient) }}</strong>
                  <span class="text-xs text-secondary">{{ patient.diagnostico_principal || 'Sin diagnóstico' }}</span>
                </button>
              } @empty {
                <p class="rounded-md bg-app p-4 text-sm text-secondary">No hay pacientes reales para comparar.</p>
              }
            </div>
          </aside>

          <article class="rounded-lg border border-line bg-surface p-5 shadow-sm">
            @if (selectedPatient(); as patient) {
              <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 class="m-0 text-xl font-bold leading-solid text-main">{{ displayName(patient) }}</h2>
                  <p class="mt-1 text-sm text-secondary">{{ patient.username }} · {{ patient.email || 'Sin correo' }}</p>
                </div>
                <span class="rounded-md px-3 py-1 text-xs font-bold" [ngClass]="patient.estado === 'inactivo' ? 'bg-danger-bg text-danger' : 'bg-primary-low text-primary'">{{ patient.estado || 'activo' }}</span>
              </div>

              <dl class="grid gap-4 md:grid-cols-2">
                <div class="rounded-md bg-app p-4">
                  <dt class="text-xs font-bold uppercase tracking-wide text-muted">Diagnóstico</dt>
                  <dd class="mt-2 text-sm font-bold text-main">{{ patient.diagnostico_principal || 'Sin dato real' }}</dd>
                </div>
                <div class="rounded-md bg-app p-4">
                  <dt class="text-xs font-bold uppercase tracking-wide text-muted">Nivel movilidad</dt>
                  <dd class="mt-2 text-sm font-bold text-main">{{ patient.nivel_movilidad || 'Sin dato real' }}</dd>
                </div>
                <div class="rounded-md bg-app p-4">
                  <dt class="text-xs font-bold uppercase tracking-wide text-muted">Estrategia validación</dt>
                  <dd class="mt-2 text-sm font-bold text-main">{{ patient.estrategia_validacion || 'Sin dato real' }}</dd>
                </div>
                <div class="rounded-md bg-app p-4">
                  <dt class="text-xs font-bold uppercase tracking-wide text-muted">Estrategia progreso</dt>
                  <dd class="mt-2 text-sm font-bold text-main">{{ patient.estrategia_progreso || 'Sin dato real' }}</dd>
                </div>
              </dl>

              <div class="mt-5 rounded-md border border-line bg-app p-4 text-sm text-secondary">
                No se muestran gráficas simuladas. Faltan endpoints reales de ROM, fuerza, dolor y estabilidad.
              </div>
            } @else {
              <p class="rounded-md bg-app p-4 text-sm text-secondary">Selecciona un paciente real para ver su información clínica disponible.</p>
            }
          </article>
        </div>
      }
    </section>
  `,
})
export class PerformanceComponent implements OnInit {
  private clinicalDataService = inject(ClinicalDataService);

  loading = signal(true);
  patients = signal<RoleAccount[]>([]);
  selectedPatient = signal<RoleAccount | null>(null);

  ngOnInit(): void {
    this.clinicalDataService.visiblePatients().subscribe((patients) => {
      this.patients.set(patients);
      this.selectedPatient.set(patients[0] ?? null);
      this.loading.set(false);
    });
  }

  displayName(account: RoleAccount): string {
    return this.clinicalDataService.displayName(account);
  }
}
