import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors, withXsrfConfiguration, HttpInterceptorFn, HttpXsrfTokenExtractor} from '@angular/common/http';
import { inject } from '@angular/core';

const API_BASE_URLS = ['http://localhost:8000/api/', 'http://127.0.0.1:8000/api/', '/api/'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiRequest = API_BASE_URLS.some((url) => req.url.startsWith(url));
  const token = typeof window !== 'undefined' && window.localStorage
    ? window.localStorage.getItem('token')
    : null;

  if (isApiRequest && token) {
    req = req.clone({
      setHeaders: { Authorization: `Token ${token}` }
    });
  }

  return next(req);
};

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(HttpXsrfTokenExtractor);
  const token = tokenService.getToken();

  if (token && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    req = req.clone({
      setHeaders: { 'X-CSRFToken': token }
    });
  }
  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withXsrfConfiguration({
        cookieName: 'csrftoken',
        headerName: 'X-CSRFToken',
      }),
      withInterceptors([authInterceptor, csrfInterceptor])
    ),
  ]
};
