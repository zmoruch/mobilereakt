// src/utils/api.ts

// Interfejsy TypeScript dla danych
export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  time: string;
  created_at?: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  completed: boolean;
  created_at?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Konfiguracja API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Główna klasa do obsługi API
export class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      // Konfiguracja domyślna
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      // Dodaj czasowe opóźnienie dla lepszego UX
      console.log(`🚀 API Call: ${options.method || 'GET'} ${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(`✅ API Response:`, data);
      return data;
    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Metody HTTP
  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// API dla wiadomości (chat)
export const messagesApi = {
  // Pobierz wszystkie wiadomości
  getAll: async (): Promise<Message[]> => {
    try {
      const response = await ApiService.get<Message[]>('messages');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Błąd pobierania wiadomości:', error);
      return []; // Zwróć pustą tablicę w przypadku błędu
    }
  },

  // Wyślij nową wiadomość
  create: async (messageData: { text: string; sender: 'user' | 'bot' }): Promise<Message> => {
    try {
      const response = await ApiService.post<ApiResponse<Message>>('messages', messageData);
      
      if (response.success && response.message) {
        return response.message;
      }
      
      // Fallback - utwórz wiadomość lokalnie jeśli API nie zwróci
      return {
        id: Date.now(),
        text: messageData.text,
        sender: messageData.sender,
        time: new Date().toLocaleTimeString('pl-PL', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
    } catch (error) {
      console.error('Błąd wysyłania wiadomości:', error);
      // W przypadku błędu API, zwróć wiadomość lokalnie
      return {
        id: Date.now(),
        text: messageData.text,
        sender: messageData.sender,
        time: new Date().toLocaleTimeString('pl-PL', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
    }
  },

  // Usuń wiadomość
  delete: async (id: number): Promise<boolean> => {
    try {
      await ApiService.delete(`messages/${id}`);
      return true;
    } catch (error) {
      console.error('Błąd usuwania wiadomości:', error);
      return false;
    }
  },
};

// API dla notatek
export const notesApi = {
  // Pobierz wszystkie notatki
  getAll: async (): Promise<Note[]> => {
    try {
      const response = await ApiService.get<Note[]>('notes');
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Błąd pobierania notatek:', error);
      return []; // Zwróć pustą tablicę w przypadku błędu
    }
  },

  // Utwórz nową notatkę
  create: async (noteData: { title: string; content: string }): Promise<Note> => {
    try {
      const response = await ApiService.post<ApiResponse<Note>>('notes', noteData);
      
      if (response.success && response.note) {
        return response.note;
      }
      
      // Fallback - utwórz notatkę lokalnie
      return {
        id: Date.now(),
        title: noteData.title,
        content: noteData.content,
        completed: false
      };
    } catch (error) {
      console.error('Błąd tworzenia notatki:', error);
      // W przypadku błędu API, zwróć notatkę lokalnie
      return {
        id: Date.now(),
        title: noteData.title,
        content: noteData.content,
        completed: false
      };
    }
  },

  // Aktualizuj notatkę
  update: async (id: number, noteData: Partial<Note>): Promise<Note | null> => {
    try {
      const response = await ApiService.put<ApiResponse<Note>>(`notes/${id}`, noteData);
      return response.success && response.note ? response.note : null;
    } catch (error) {
      console.error('Błąd aktualizacji notatki:', error);
      return null;
    }
  },

  // Przełącz status ukończenia notatki
  toggleComplete: async (id: number, completed: boolean): Promise<boolean> => {
    try {
      await ApiService.put(`notes/${id}`, { completed });
      return true;
    } catch (error) {
      console.error('Błąd zmiany statusu notatki:', error);
      return false;
    }
  },

  // Usuń notatkę
  delete: async (id: number): Promise<boolean> => {
    try {
      await ApiService.delete(`notes/${id}`);
      return true;
    } catch (error) {
      console.error('Błąd usuwania notatki:', error);
      return false;
    }
  },
};

// API dla ogólnych danych aplikacji
export const appApi = {
  // Pobierz status aplikacji
  getStatus: async (): Promise<{ status: string; message: string }> => {
    try {
      return await ApiService.get<{ status: string; message: string }>('status');
    } catch (error) {
      return { status: 'offline', message: 'Brak połączenia z serwerem' };
    }
  },

  // Wyślij feedback
  sendFeedback: async (feedback: { type: string; message: string }): Promise<boolean> => {
    try {
      await ApiService.post('feedback', feedback);
      return true;
    } catch (error) {
      console.error('Błąd wysyłania feedback:', error);
      return false;
    }
  },
};

// Hook do sprawdzania połączenia z API
export const useApiStatus = () => {
  const checkConnection = async (): Promise<boolean> => {
    try {
      const status = await appApi.getStatus();
      return status.status === 'online';
    } catch {
      return false;
    }
  };

  return { checkConnection };
};

// Utility function do formatowania daty
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Export domyślny dla wygody
export default ApiService;