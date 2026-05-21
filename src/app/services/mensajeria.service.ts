import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BackendConversation, BackendMessage } from '../models/mensajeria.models';

@Injectable({
  providedIn: 'root'
})
export class MensajeriaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api/mensajeria';

  private httpOptions = {
    withCredentials: true
  };

  getConversaciones(): Observable<BackendConversation[]> {
    return this.http.get<BackendConversation[]>(`${this.apiUrl}/conversaciones/`, this.httpOptions);
  }

  getMensajes(conversationId: number): Observable<BackendMessage[]> {
    return this.http.get<BackendMessage[]>(`${this.apiUrl}/mensajes/`, this.httpOptions);
  }

  enviarMensaje(conversationId: number, text: string | null, file: File | null): Observable<BackendMessage> {
    const formData = new FormData();
    formData.append('conversation', conversationId.toString());

    if (text) formData.append('encrypted_text', text);
    if (file) formData.append('file_attachment', file);

    return this.http.post<BackendMessage>(`${this.apiUrl}/mensajes/`, formData, this.httpOptions);
  }

  marcarComoVisto(mensajeId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/mensajes/${mensajeId}/cambiar_estado/`, { status: 'visto' }, this.httpOptions);
  }
}
