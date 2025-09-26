/**
 * Cliente HTTP padronizado para APIs
 * Centraliza todas as chamadas para api.aiensed.com
 */

import { config } from './config';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
  timestamp?: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      timeout: this.timeout,
    };

    try {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(url.pathname + url.search, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Métodos específicos para o sistema de propostas
  async getProposals(params?: {
    status?: string[];
    owner_id?: string;
    client_id?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return this.get('/proposals', params);
  }

  async createProposal(data: {
    title: string;
    client_id?: string;
    valid_until?: string;
    currency?: string;
  }) {
    return this.post('/proposals', data);
  }

  async getProposal(id: string) {
    return this.get(`/proposals/${id}`);
  }

  async updateProposal(id: string, data: any) {
    return this.patch(`/proposals/${id}`, data);
  }

  async deleteProposal(id: string) {
    return this.delete(`/proposals/${id}`);
  }

  async getClients(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return this.get('/clients', params);
  }

  async createClient(data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    document?: string;
  }) {
    return this.post('/clients', data);
  }

  async getCatalogItems(params?: {
    search?: string;
    category?: string;
    active_only?: boolean;
  }) {
    return this.get('/catalog/items', params);
  }

  async createCatalogItem(data: {
    sku: string;
    name: string;
    description?: string;
    category: string;
    unit_price: number;
    currency?: string;
    is_active?: boolean;
  }) {
    return this.post('/catalog/items', data);
  }

  async trackEvent(data: {
    event: string;
    properties?: Record<string, any>;
    user_id?: string;
    session_id?: string;
  }) {
    return this.post('/analytics/event', data);
  }
}

// Instância singleton
export const apiClient = new ApiClient();

// Hook para usar o cliente em componentes React
export function useApiClient() {
  return apiClient;
}
