export interface BackendMessage {
  id: number;
  conversation: number;
  sender: number;
  encrypted_text: string | null;
  file_attachment: string | null;
  timestamp: string;
  status: 'enviado' | 'entregado' | 'visto';
}

export interface BackendConversation {
  id: number;
  paciente: number;
  terapeuta: number;
  created_at: string;
  updated_at: string;
  ultimo_mensaje: BackendMessage | null;
}
