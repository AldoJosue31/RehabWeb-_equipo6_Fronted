import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RoleAccount } from '../../services/account-admin.service';
import { ClinicalDataService } from '../../services/clinical-data.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mx-auto grid max-w-6xl gap-5">
      <header>
        <h1 class="m-0 text-2xl font-bold leading-solid text-nav">Alertas de Inactividad</h1>
        <p class="mt-1 text-sm leading-default text-secondary">Alertas derivadas del estado real de los pacientes.</p>
      </header>

      @if (loading()) {
        <div class="rounded-lg border border-line bg-surface p-6 text-sm text-secondary shadow-sm">Cargando pacientes reales...</div>
      } @else {
        <div class="grid gap-4 md:grid-cols-3">
          <article class="rounded-lg border border-line bg-surface p-5 shadow-sm">
            <p class="m-0 text-sm font-medium text-secondary">Pacientes visibles</p>
            <p class="mt-2 text-2xl font-bold leading-solid text-main">{{ patients().length }}</p>
          </article>
          <article class="rounded-lg border border-line bg-surface p-5 shadow-sm">
            <p class="m-0 text-sm font-medium text-secondary">Inactivos</p>
            <p class="mt-2 text-2xl font-bold leading-solid text-danger">{{ inactivePatients().length }}</p>
          </article>
          <article class="rounded-lg border border-line bg-surface p-5 shadow-sm">
            <p class="m-0 text-sm font-medium text-secondary">Activos</p>
            <p class="mt-2 text-2xl font-bold leading-solid text-primary">{{ activeCount() }}</p>
          </article>
        </div>

        <div class="grid gap-4">
          @for (patient of inactivePatients(); track patient.id) {
            <article class="grid gap-4 rounded-lg border border-line bg-surface p-4 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 class="m-0 text-base font-bold leading-solid text-main">{{ displayName(patient) }}</h2>
                <p class="mt-1 text-sm text-secondary">{{ patient.diagnostico_principal || 'Sin diagnóstico registrado' }}</p>
              </div>
              <span class="rounded-md bg-danger-bg px-3 py-1 text-xs font-bold text-danger">{{ patient.estado }}</span>
            </article>
          } @empty {
            <p class="rounded-lg border border-line bg-surface p-6 text-sm text-secondary shadow-sm">No hay pacientes inactivos en los datos reales actuales.</p>
          }
        </div>
      }
    </section>
  `,
})
export class AlertsComponent implements OnInit {
  private clinicalDataService = inject(ClinicalDataService);

  loading = signal(true);
  patients = signal<RoleAccount[]>([]);
  inactivePatients = computed(() => this.patients().filter((patient) => patient.estado === 'inactivo'));
  activeCount = computed(() => this.patients().filter((patient) => patient.estado !== 'inactivo').length);

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
