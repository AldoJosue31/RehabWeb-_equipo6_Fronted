import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RoleAccount } from '../../services/account-admin.service';
import { AuthService } from '../../services/auth.service';
import { ClinicalDataService } from '../../services/clinical-data.service';
import { EngagementService, MotivationProfile } from '../../services/engagement.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="rw-page rw-page--narrow">
      <header class="rw-page-header">
        <div>
          <h1 class="rw-title">Configuraciones</h1>
          <p class="rw-subtitle">Información real de la cuenta autenticada.</p>
        </div>
      </header>

      <article class="rw-card rw-card-pad grid gap-5">
        @if (loading()) {
          <p class="m-0 text-sm text-secondary">Cargando cuenta real...</p>
        } @else if (account(); as currentAccount) {
          <div class="grid gap-2">
            <h2 class="m-0 text-lg font-bold leading-solid text-main">{{ displayName(currentAccount) }}</h2>
            <p class="m-0 text-sm text-secondary">{{ roleLabel() }}</p>
          </div>

          <dl class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-md bg-app p-4">
              <dt class="text-xs font-bold uppercase tracking-wide text-muted">Usuario</dt>
              <dd class="mt-2 text-sm font-bold text-main">{{ currentAccount.username }}</dd>
            </div>
            <div class="rounded-md bg-app p-4">
              <dt class="text-xs font-bold uppercase tracking-wide text-muted">Correo</dt>
              <dd class="mt-2 text-sm font-bold text-main">{{ currentAccount.email || 'Sin correo' }}</dd>
            </div>

            @if (role() === 'terapeuta') {
              <div class="rounded-md bg-app p-4">
                <dt class="text-xs font-bold uppercase tracking-wide text-muted">Especialidad</dt>
                <dd class="mt-2 text-sm font-bold text-main">{{ currentAccount.especialidad || 'Sin dato' }}</dd>
              </div>
              <div class="rounded-md bg-app p-4">
                <dt class="text-xs font-bold uppercase tracking-wide text-muted">Licencia</dt>
                <dd class="mt-2 text-sm font-bold text-main">{{ currentAccount.numero_licencia || 'Sin dato' }}</dd>
              </div>
            } @else {
              <div class="rounded-md bg-app p-4">
                <dt class="text-xs font-bold uppercase tracking-wide text-muted">Diagnóstico</dt>
                <dd class="mt-2 text-sm font-bold text-main">{{ currentAccount.diagnostico_principal || 'Sin dato' }}</dd>
              </div>
              <div class="rounded-md bg-app p-4">
                <dt class="text-xs font-bold uppercase tracking-wide text-muted">Nivel movilidad</dt>
                <dd class="mt-2 text-sm font-bold text-main">{{ currentAccount.nivel_movilidad || 'Sin dato' }}</dd>
              </div>
            }
          </dl>

          @if (role() === 'paciente' && motivation(); as stats) {
            <div class="rounded-md border border-line bg-app p-4">
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 class="m-0 text-base font-bold text-main">Ranking opcional</h3>
                  <p class="m-0 mt-1 text-sm text-secondary">
                    {{ stats.leaderboard_enabled ? 'Participa solo con consentimiento explicito; se muestra Top 10 sin posicion exacta.' : 'No disponible para menores.' }}
                  </p>
                </div>
                <label class="inline-flex items-center gap-3 text-sm font-bold text-main" [ngClass]="stats.leaderboard_enabled ? '' : 'opacity-50'">
                  <input type="checkbox" [checked]="stats.leaderboard_opt_in" [disabled]="!stats.leaderboard_enabled" (change)="toggleRanking($any($event.target).checked)" />
                  Participar
                </label>
              </div>
            </div>
          }
        } @else {
          <p class="rounded-md border border-line bg-app p-4 text-sm text-secondary">No se pudo cargar la información de la cuenta actual.</p>
        }
      </article>
    </section>
  `,
})
export class SettingsComponent implements OnInit {
  private authService = inject(AuthService);
  private clinicalDataService = inject(ClinicalDataService);
  private engagementService = inject(EngagementService);

  loading = signal(true);
  account = signal<RoleAccount | null>(null);
  motivation = signal<MotivationProfile | null>(null);
  role = computed(() => this.authService.getRole() ?? 'paciente');
  roleLabel = computed(() => this.role() === 'terapeuta' ? 'Terapeuta' : 'Paciente');

  ngOnInit(): void {
    this.clinicalDataService.currentAccount().subscribe((account) => {
      this.account.set(account);
      this.loading.set(false);
    });
    if (this.role() === 'paciente') {
      this.engagementService.getMotivation().subscribe((motivation) => this.motivation.set(motivation));
    }
  }

  displayName(account: RoleAccount): string {
    return this.clinicalDataService.displayName(account);
  }

  toggleRanking(leaderboard_opt_in: boolean): void {
    this.engagementService.updateMotivation({ leaderboard_opt_in }).subscribe((motivation) => this.motivation.set(motivation));
  }
}
