import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthRole, AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  role = signal<AuthRole>('terapeuta');
  loading = signal(false);
  errorMsg = signal('');

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      void this.router.navigateByUrl('/mensajeria');
    }
  }

  setRole(role: AuthRole): void {
    this.role.set(role);
    this.errorMsg.set('');
  }

  toggleRole(): void {
    this.setRole(this.role() === 'terapeuta' ? 'paciente' : 'terapeuta');
  }

  submit(): void {
    if (this.loginForm.invalid || this.loading()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    this.loading.set(true);
    this.errorMsg.set('');

    this.authService.login(username.trim(), password, this.role()).subscribe({
      next: () => void this.router.navigateByUrl('/mensajeria'),
      error: (error: { status?: number; error?: { detail?: string } }) => {
        this.loading.set(false);
        if (error.status === 403) {
          this.errorMsg.set(error.error?.detail ?? 'Este usuario no tiene el rol seleccionado.');
          return;
        }
        this.errorMsg.set('Usuario o contrasena incorrectos.');
      },
    });
  }
}
