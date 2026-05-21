import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RoleAccount } from '../../services/account-admin.service';
import { AuthService } from '../../services/auth.service';
import { ClinicalDataService, DashboardData } from '../../services/clinical-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mx-auto grid max-w-6xl gap-5">
      <header class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="m-0 text-2xl font-bold leading-solid text-nav">{{ role() === 'paciente' ? 'Mi tablero' : 'Tablero de Control' }}</h1>
          <p class="mt-1 text-sm leading-default text-secondary">{{ subtitle() }}</p>
        </div>
        @if (role() === 'terapeuta') {
          <a class="flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-primary/90" href="/mensajeria">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            Abrir mensajería
          </a>
        }
      </header>

      @if (loading()) {
        <div class="rounded-lg border border-line bg-surface p-6 text-sm text-secondary shadow-sm">Cargando información real del usuario...</div>
      } @else if (errorMsg()) {
        <div class="rounded-lg border border-danger bg-danger-bg p-4 text-sm font-bold text-danger">{{ errorMsg() }}</div>
      } @else {
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          @for (metric of metrics(); track metric.label) {
            <article class="rounded-lg border border-line bg-surface p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <p class="m-0 text-sm font-medium text-secondary">{{ metric.label }}</p>
              <p class="mt-2 text-2xl font-bold leading-solid text-main">{{ metric.value }}</p>
              <span class="mt-4 inline-flex rounded-full px-2 py-1 text-xs font-bold" [ngClass]="metric.className">{{ metric.caption }}</span>
            </article>
          }
        </div>

        @if (role() === 'terapeuta') {
          <article class="rounded-lg border border-line bg-surface p-5 shadow-sm">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 class="m-0 text-lg font-bold leading-solid text-main">Pacientes visibles</h2>
                <p class="m-0 text-sm text-secondary">Datos cargados desde cuentas y conversaciones reales.</p>
              </div>
              <span class="rounded-full bg-primary-low px-3 py-1 text-xs font-bold text-primary">{{ patients().length }} registros</span>
            </div>

            <div class="grid gap-3 md:grid-cols-2">
              @for (patient of patients(); track patient.id) {
                <div class="rounded-lg border border-line bg-app p-4">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <h3 class="m-0 text-base font-bold leading-solid text-main">{{ displayName(patient) }}</h3>
                      <p class="mt-1 text-sm text-secondary">{{ patient.diagnostico_principal || 'Sin diagnóstico registrado' }}</p>
                    </div>
                    <span class="rounded-md px-3 py-1 text-xs font-bold" [ngClass]="statusClass(patient)">{{ patient.estado || 'activo' }}</span>
                  </div>
                </div>
              } @empty {
                <p class="rounded-md border border-line bg-app p-4 text-sm text-secondary">No hay pacientes reales vinculados para mostrar.</p>
              }
            </div>
          </article>
        } @else {
          <article class="rounded-lg border border-line bg-surface p-5 shadow-sm">
            <h2 class="m-0 text-lg font-bold leading-solid text-main">Información clínica</h2>
            @if (currentAccount()) {
              <dl class="mt-5 grid gap-4 sm:grid-cols-2">
                <div class="rounded-md bg-app p-4">
                  <dt class="text-xs font-bold uppercase tracking-wide text-muted">Diagnóstico</dt>
                  <dd class="mt-2 text-sm font-bold text-main">{{ currentAccount()?.diagnostico_principal || 'Sin diagnóstico registrado' }}</dd>
                </div>
                <div class="rounded-md bg-app p-4">
                  <dt class="text-xs font-bold uppercase tracking-wide text-muted">Nivel movilidad</dt>
                  <dd class="mt-2 text-sm font-bold text-main">{{ currentAccount()?.nivel_movilidad || 'Sin dato' }}</dd>
                </div>
                <div class="rounded-md bg-app p-4">
                  <dt class="text-xs font-bold uppercase tracking-wide text-muted">Estrategia validación</dt>
                  <dd class="mt-2 text-sm font-bold text-main">{{ currentAccount()?.estrategia_validacion || 'Sin dato' }}</dd>
                </div>
                <div class="rounded-md bg-app p-4">
                  <dt class="text-xs font-bold uppercase tracking-wide text-muted">Estrategia progreso</dt>
                  <dd class="mt-2 text-sm font-bold text-main">{{ currentAccount()?.estrategia_progreso || 'Sin dato' }}</dd>
                </div>
              </dl>
            } @else {
              <p class="mt-4 rounded-md border border-line bg-app p-4 text-sm text-secondary">No se pudo cargar la cuenta actual.</p>
            }
          </article>
        }
      }
    </section>
  `,
})
export class DashboardComponent implements OnInit {
  private clinicalDataService = inject(ClinicalDataService);
  private authService = inject(AuthService);

  loading = signal(true);
  errorMsg = signal('');
  dashboardData = signal<DashboardData | null>(null);
  role = computed(() => this.authService.getRole() ?? 'paciente');
  patients = computed(() => this.dashboardData()?.patients ?? []);
  currentAccount = computed(() => this.dashboardData()?.currentAccount ?? null);
  subtitle = computed(() => this.role() === 'paciente'
    ? 'Información real asociada a tu cuenta y plan clínico.'
    : 'Resumen basado en pacientes y conversaciones reales vinculadas a tu usuario.');
  metrics = computed(() => {
    const patients = this.patients();
    const conversations = this.dashboardData()?.conversations ?? [];
    const inactive = patients.filter((patient) => patient.estado === 'inactivo').length;

    if (this.role() === 'paciente') {
      return [
        { label: 'Conversaciones', value: conversations.length.toString(), caption: 'Mensajería real', className: 'bg-primary-low text-primary' },
        { label: 'Estado', value: this.currentAccount()?.estado || 'Sin dato', caption: 'Perfil del paciente', className: this.statusClass(this.currentAccount()) },
        { label: 'Movilidad', value: this.currentAccount()?.nivel_movilidad || 'Sin dato', caption: 'Perfil clínico', className: 'bg-info/10 text-info' },
        { label: 'Terapeuta asignado', value: this.currentAccount()?.terapeuta_id ? 'Asignado' : 'Sin asignar', caption: 'Cuenta real', className: 'bg-line text-secondary' },
      ];
    }

    return [
      { label: 'Pacientes', value: patients.length.toString(), caption: 'Cuentas visibles', className: 'bg-primary-low text-primary' },
      { label: 'Activos', value: patients.filter((patient) => patient.estado !== 'inactivo').length.toString(), caption: 'Estado activo', className: 'bg-primary-low text-primary' },
      { label: 'Inactivos', value: inactive.toString(), caption: 'Requieren seguimiento', className: inactive ? 'bg-danger-bg text-danger' : 'bg-line text-secondary' },
      { label: 'Conversaciones', value: conversations.length.toString(), caption: 'Chats reales', className: 'bg-info/10 text-info' },
    ];
  });

  ngOnInit(): void {
    this.clinicalDataService.dashboardData().subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudo cargar la información real del usuario.');
        this.loading.set(false);
      },
    });
  }

  displayName(account: RoleAccount | null): string {
    return this.clinicalDataService.displayName(account);
  }

  statusClass(account: RoleAccount | null): string {
    return account?.estado === 'inactivo' ? 'bg-danger-bg text-danger' : 'bg-primary-low text-primary';
  }
}
