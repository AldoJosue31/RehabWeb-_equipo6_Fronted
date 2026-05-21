export interface BackendMessage {
  id: number;
  conversation: number;
  sender: number;
  encrypted_text: string | null;
  file_attachment: string | null;
  timestamp: string;
  status: 'enviado' | 'entregado' | 'visto';
}

export interface BackendContactInfo {
  id: number;
  username: string;
  nombre_completo: string;
  email: string;
  role: 'terapeuta' | 'paciente';
  especialidad?: string;
  numero_licencia?: string;
  estado?: string;
  fecha_nacimiento?: string | null;
  estrategia_validacion?: string;
  estrategia_progreso?: string;
}

export interface BackendConversation {
  id: number;
  paciente: number;
  terapeuta: number;
  paciente_info: BackendContactInfo;
  terapeuta_info: BackendContactInfo;
  created_at: string;
  updated_at: string;
  ultimo_mensaje: BackendMessage | null;
}
