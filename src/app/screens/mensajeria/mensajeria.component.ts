import { Component, signal, ViewChild, ElementRef, ChangeDetectionStrategy, effect, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { MensajeriaService } from '../../services/mensajeria.service';
import { AuthRole, AuthService } from '../../services/auth.service';
import { BackendContactInfo, BackendConversation, BackendMessage } from '../../models/mensajeria.models';
import { interval, Subscription, startWith } from 'rxjs';

interface UIMessage {
  id: string;
  text: string;
  sender: 'terapeuta' | 'paciente';
  timestamp: Date;
  status: string;
  fileName?: string;
  fileUrl?: string;
  isJoinableCall?: boolean;
}

interface UIPatient {
  id: string;
  name: string;
  lastMessageTime: string;
  lastMessagePreview: string;
  initials: string;
  isOnline: boolean;
  roleLabel: string;
}

@Component({
  selector: 'app-mensajeria',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mensajeria.component.html',
  styleUrl: './mensajeria.component.scss'
})
export class MensajeriaComponent implements OnInit, OnDestroy {
  private mensajeriaService = inject(MensajeriaService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private pollingSub?: Subscription;

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  currentUserId: number = 0;
  currentUserRole: AuthRole = 'terapeuta';
  currentUsername = '';

  messageCtrl = new FormControl('');
  selectedFile = signal<File | null>(null);
  errorMsg = signal<string>('');
  isSending = signal<boolean>(false);

  jitsiRoomUrl = signal<SafeResourceUrl | null>(null);
  activeVideoCallId = signal<number | null>(null);

  conversations = signal<BackendConversation[]>([]);
  messages = signal<BackendMessage[]>([]);
  selectedConvId = signal<number | null>(null);

  patients = computed<UIPatient[]>(() => {
    return this.conversations().map(conv => {
      const amIPaciente = conv.paciente === this.currentUserId;
      const contact = amIPaciente ? conv.terapeuta_info : conv.paciente_info;
      const roleLabel = amIPaciente ? 'Terapeuta' : 'Paciente';
      const contactName = this.contactDisplayName(contact, roleLabel);
      return {
        id: conv.id.toString(),
        name: contactName,
        initials: this.contactInitials(contactName, roleLabel),
        lastMessageTime: conv.ultimo_mensaje ? this.formatTime(new Date(conv.ultimo_mensaje.timestamp)) : '',
        lastMessagePreview: conv.ultimo_mensaje?.encrypted_text || (conv.ultimo_mensaje?.file_attachment ? '📎 Archivo' : 'Sin mensajes'),
        isOnline: true,
        roleLabel
      };
    });
  });

  selectedPatientId = computed(() => this.selectedConvId()?.toString() || '');
  activePatient = computed(() => this.patients().find(p => p.id === this.selectedPatientId()) || {
    id: '',
    name: 'Seleccione un chat',
    lastMessageTime: '',
    lastMessagePreview: '',
    initials: '?',
    isOnline: false,
    roleLabel: 'Contacto'
  });

  activeMessages = computed<UIMessage[]>(() => {
    const convId = this.selectedConvId();
    if (!convId) return [];

    const rawMsgs = this.messages().filter(m => m.conversation === convId);

    // Identificamos el estado mas reciente de las videollamadas en la conversación
    const mensajesVideo = rawMsgs.filter(m =>
      m.encrypted_text?.includes('Videollamada iniciada') ||
      m.encrypted_text === 'Videollamada finalizada'
    );
    const ultimoMsjVideo = mensajesVideo.length > 0 ? mensajesVideo[mensajesVideo.length - 1] : null;

    return rawMsgs.map(m => {
      const isJoinable = ultimoMsjVideo &&
                         ultimoMsjVideo.id === m.id &&
                         m.encrypted_text?.includes('Videollamada iniciada');

      return {
        id: m.id.toString(),
        text: m.encrypted_text || '',
        sender: m.sender === this.currentUserId ? this.currentUserRole : this.otherRole(),
        timestamp: new Date(m.timestamp),
        status: m.status,
        fileName: m.file_attachment ? m.file_attachment.split('/').pop() : undefined,
        fileUrl: m.file_attachment || undefined,
        isJoinableCall: !!isJoinable
      };
    });
  });

  constructor() {
    effect(() => {
      this.activeMessages();
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  ngOnInit() {
    const token = this.authService.getToken();
    const savedId = this.authService.getCurrentUserId();
    const savedRole = this.authService.getRole();
    if (!token || !savedId || !savedRole) {
      this.showError('Inicia sesion para ver tus conversaciones.');
      void this.router.navigateByUrl('/login');
      return;
    }

    // Buscamos si el ID viene por la URL (como en tus pruebas: ?user=3)
    const userParam: string | null = null;

    // Buscamos si el ID ya está guardado de un login previo
    const legacySavedId = savedId.toString();

    if (userParam) {
      this.currentUserId = parseInt(userParam);
      // Guardamos en memoria para que no se pierda al recargar la página
      this.setStoredUserId(userParam);
    } else if (legacySavedId) {
      this.currentUserId = parseInt(legacySavedId);
    } else {
      this.showError('No se encontro el usuario autenticado.');
      return;
    }

    this.currentUserRole = savedRole;
    this.currentUsername = this.authService.getUsername() ?? '';

    // Solo hacemos peticiones al backend si tenemos un ID válido
    if (this.currentUserId > 0) {
      this.cargarConversaciones();
      this.iniciarPolling();
    }
  }

  ngOnDestroy() {
    if (this.pollingSub) this.pollingSub.unsubscribe();
  }

  private iniciarPolling() {
    this.pollingSub = interval(4000)
      .pipe(startWith(0))
      .subscribe(() => {
        const convId = this.selectedConvId();
        if (convId) this.cargarMensajes(convId);
        this.mensajeriaService.getConversaciones().subscribe({
          next: data => this.conversations.set(data),
          error: err => this.handleAuthError(err)
        });
      });
  }

  cargarConversaciones() {
    this.mensajeriaService.getConversaciones().subscribe({
      next: (data) => {
        this.conversations.set(data);
        if (data.length > 0 && !this.selectedConvId()) {
          this.selectPatient(data[0].id.toString());
        }
      },
      error: (err) => this.handleAuthError(err)
    });
  }

  selectPatient(id: string) {
    const convId = parseInt(id);
    this.selectedConvId.set(convId);
    this.cargarMensajes(convId);
    this.jitsiRoomUrl.set(null);
  }

   cargarMensajes(convId: number) {
    this.mensajeriaService.getMensajes(convId).subscribe({
      next: (data) => {
        const filtered = data.filter(m => m.conversation === convId);
        if (JSON.stringify(filtered) !== JSON.stringify(this.messages())) {
          this.messages.set(filtered);
          this.marcarComoVistos(filtered);

          const mensajesVideo = filtered.filter(m =>
            m.encrypted_text?.includes('Videollamada iniciada') ||
            m.encrypted_text === 'Videollamada finalizada'
          );

          const ultimoMsjVideo = mensajesVideo.length > 0 ? mensajesVideo[mensajesVideo.length - 1] : null;

          if (ultimoMsjVideo && ultimoMsjVideo.encrypted_text === 'Videollamada finalizada' && this.jitsiRoomUrl() !== null) {
              console.log("Cerrando sala automáticamente porque la otra parte colgó.");
              this.jitsiRoomUrl.set(null);
              this.activeVideoCallId.set(null);
          }
        }
      },
      error: (err) => this.handleAuthError(err)
    });
  }

  private marcarComoVistos(mensajes: BackendMessage[]) {
    const pendientes = mensajes.filter(m => m.sender !== this.currentUserId && m.status !== 'visto');
    pendientes.forEach(msg => {
      this.mensajeriaService.marcarComoVisto(msg.id).subscribe({
        next: () => {
          this.messages.update(state => state.map(m => m.id === msg.id ? { ...m, status: 'visto' } : m));
        },
        error: err => this.handleAuthError(err)
      });
    });
  }

  sendMessage() {
    const text = this.messageCtrl.value?.trim() || null;
    const file = this.selectedFile();
    const convId = this.selectedConvId();
    if ((!text && !file) || !convId) return;

    this.isSending.set(true);

    this.mensajeriaService.enviarMensaje(convId, text, file).subscribe({
      next: (newMsg) => {
        this.messages.update(msgs => [...msgs, newMsg]);
        this.messageCtrl.setValue('');
        this.selectedFile.set(null);
        this.isSending.set(false);
        this.scrollToBottom();
        this.cargarConversaciones(); // Para actualizar el preview de la izquierda
      },
      error: (err) => {
        this.isSending.set(false);
        if (!this.handleAuthError(err)) this.showError('Error al enviar el mensaje.');
      }
    });
  }

  private getAuthToken(): string | null {
    return typeof window !== 'undefined' && window.localStorage
      ? window.localStorage.getItem('token')
      : null;
  }

  private getStoredUserId(): string | null {
    return typeof window !== 'undefined' && window.localStorage
      ? window.localStorage.getItem('user_id')
      : null;
  }

  private setStoredUserId(userId: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('user_id', userId);
    }
  }

  private stopPolling() {
    if (this.pollingSub) {
      this.pollingSub.unsubscribe();
      this.pollingSub = undefined;
    }
  }

  private handleAuthError(err: { status?: number }): boolean {
    if (err.status === 401 || err.status === 403) {
      this.stopPolling();
      this.authService.logout();
      this.showError('Sesion expirada o no iniciada.');
      void this.router.navigateByUrl('/login');
      return true;
    }

    return false;
  }

  private showError(msg: string) {
    this.errorMsg.set(msg);
    setTimeout(() => this.errorMsg.set(''), 5000);
  }

  private scrollToBottom(): void {
    if (this.chatContainer) this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  }

  roleName(role: AuthRole): string {
    return role === 'terapeuta' ? 'Terapeuta' : 'Paciente';
  }

  private contactDisplayName(contact: BackendContactInfo | undefined, fallbackRole: string): string {
    if (!contact) return fallbackRole;

    const name = contact.nombre_completo?.trim() || contact.username?.trim();
    return name || fallbackRole;
  }

  private contactInitials(name: string, fallbackRole: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return (parts[0]?.slice(0, 2) || fallbackRole.slice(0, 1)).toUpperCase();
  }

  logout(): void {
    this.stopPolling();
    this.authService.logout();
    void this.router.navigateByUrl('/login');
  }

  private otherRole(): AuthRole {
    return this.currentUserRole === 'terapeuta' ? 'paciente' : 'terapeuta';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0] as File;
    if (file && file.size < 5 * 1024 * 1024) this.selectedFile.set(file);
    else if (file) this.showError('El archivo excede los 5MB.');
  }

  removeFile() { this.selectedFile.set(null); }

  iniciarVideollamada() {
    const convId = this.selectedConvId();
    if (!convId) {
      this.showError('Selecciona un chat primero.');
      return;
    }

    this.http.post<any>('http://localhost:8000/api/mensajeria/videollamadas/iniciar_llamada/', {
      conversation_id: convId
    }, {
      withCredentials: true
    }).subscribe({
      next: (res) => {
        this.activeVideoCallId.set(res.id);
        const roomId = res.room_id;

        //Botones seleccionados para vista
        const botonesHabilitados = '["camera","microphone","desktop","fullscreen","settings"]';

        //Saltar sala de pre-unión, silenciado inicial de micrófono y cámara, y deshabilitar deep linking para evitar que se abra la app móvil si el usuario accede desde un celular
        const configuracionesExtras = 'config.disableDeepLinking=true&config.startWithAudioMuted=true&config.startWithVideoMuted=true&config.hideConferenceSubject=true';

        const jitsiUrl = `https://meet.jit.si/RehabWeb-${roomId}#${configuracionesExtras}&config.toolbarButtons=${botonesHabilitados}`;

        this.jitsiRoomUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(jitsiUrl));
      },
      error: (err) => {
        console.error('Error al generar sala de video:', err);
        if (!this.handleAuthError(err)) {
          this.showError('No se pudo iniciar la videollamada. Intenta nuevamente.');
        }
      }
    });
  }

  terminarVideollamada() {
    // Cerramos el iframe visualmente de inmediato
    this.jitsiRoomUrl.set(null);

    const convId = this.selectedConvId();
    const callId = this.activeVideoCallId();

    const currentMsgs = this.activeMessages();

    const videoMsgs = currentMsgs.filter(m =>
      m.text.includes('Videollamada iniciada') ||
      m.text === 'Videollamada finalizada'
    );
    const lastVideoMsg = videoMsgs.length > 0 ? videoMsgs[videoMsgs.length - 1] : null;

    const isAlreadyEnded = lastVideoMsg && lastVideoMsg.text === 'Videollamada finalizada';

    // Avisamos en el chat que la llamada terminó
    if (convId && !isAlreadyEnded) {
      this.mensajeriaService.enviarMensaje(convId, 'Videollamada finalizada', null).subscribe({
        next: (newMsg) => {
          this.messages.update(msgs => [...msgs, newMsg]);
          this.scrollToBottom();
          this.cargarConversaciones();
        },
        error: (err) => {
          if (!this.handleAuthError(err)) console.error('No se pudo enviar el aviso de fin de llamada', err);
        }
      });
    }

    // Cierre en la base de datos
    if (callId) {
      this.http.post(`http://localhost:8000/api/mensajeria/videollamadas/${callId}/finalizar_llamada/`, {}, {
        withCredentials: true
      }).subscribe({
        next: () => {
          this.activeVideoCallId.set(null);
          console.log("Sala cerrada en el backend correctamente.");
        },
        error: (err) => {
          if (!this.handleAuthError(err)) console.error('Error al cerrar la sala en Django', err);
        }
      });
    }
  }
}
