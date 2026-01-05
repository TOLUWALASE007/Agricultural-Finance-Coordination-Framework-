const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from sessionStorage
const getAuthToken = (): string | null => {
  return sessionStorage.getItem('authToken');
};

// API request helper
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const error = await response.json();
      errorMessage = error.error || error.message || `Server error: ${response.status}`;

      // If 401 and no token, provide helpful message
      if (response.status === 401 && !token) {
        errorMessage = 'Access token required. Please log in first.';
      }
    } catch {
      if (response.status === 401) {
        errorMessage = 'Access token required. Please log in first.';
      } else {
        errorMessage = `Network error: ${response.status} ${response.statusText}`;
      }
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// Scheme API
export const schemeAPI = {
  // Create a new scheme
  create: async (schemeData: any) => {
    return apiRequest('/schemes', {
      method: 'POST',
      body: JSON.stringify(schemeData),
    });
  },

  // Get all schemes
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    state?: string;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.state) queryParams.append('state', params.state);
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    return apiRequest(`/schemes${queryString ? `?${queryString}` : ''}`);
  },

  // Get a single scheme by ID
  getById: async (id: string) => {
    return apiRequest(`/schemes/${id}`);
  },

  // Update scheme status
  updateStatus: async (id: string, status: 'Active' | 'Inactive' | 'Completed') => {
    return apiRequest(`/schemes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Update scheme details
  update: async (id: string, schemeData: any) => {
    return apiRequest(`/schemes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(schemeData),
    });
  },

  // Delete a scheme
  delete: async (id: string) => {
    return apiRequest(`/schemes/${id}`, {
      method: 'DELETE',
    });
  },
};

// Auth API
export const authAPI = {
  // Register a new user
  register: async (userData: any) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login
  login: async (credentials: { email: string; password: string; role?: string }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// User API
export const userAPI = {
  // List users with filters
  list: async (filters: any = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/users?${queryParams}`, {
      method: 'GET'
    });
  },

  // Verify a user
  verify: async (id: string) => {
    return apiRequest(`/users/${id}/verify`, {
      method: 'PUT'
    });
  },

  // Deactivate a user
  deactivate: async (id: string) => {
    return apiRequest(`/users/${id}/deactivate`, {
      method: 'PUT'
    });
  },

  // Activate a user
  activate: async (id: string) => {
    return apiRequest(`/users/${id}/activate`, {
      method: 'PUT'
    });
  },
};

// Document API
export const documentAPI = {
  // Upload a document (no auth required for registration)
  upload: async (file: File, documentType: string = 'other', description: string = '', requireAuth: boolean = false) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);
    formData.append('description', description);

    const token = requireAuth ? getAuthToken() : null;
    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      try {
        const error = await response.json();
        errorMessage = error.error || error.message || `Upload error: ${response.status}`;
      } catch {
        errorMessage = `Network error: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },

  // Get all documents for the current user
  getAll: async (params?: { page?: number; limit?: number; documentType?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.documentType) queryParams.append('documentType', params.documentType);

    const queryString = queryParams.toString();
    return apiRequest(`/documents${queryString ? `?${queryString}` : ''}`);
  },

  // Download a document
  download: async (id: string) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/documents/${id}/download`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    return blob;
  },

  // Link documents to user after registration
  linkToUser: async (documentIds: string[], userId: string) => {
    const response = await fetch(`${API_BASE_URL}/documents/link-to-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ documentIds, userId })
    });

    if (!response.ok) {
      throw new Error('Failed to link documents to user');
    }

    return response.json();
  }
};

// Notification API
export const notificationAPI = {
  // Get notifications by target role (for coordinating agency)
  getByRole: async (targetRole: string, params?: { page?: number; limit?: number; type?: string; requiresDecision?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.requiresDecision !== undefined) queryParams.append('requiresDecision', params.requiresDecision.toString());

    const queryString = queryParams.toString();
    return apiRequest(`/notifications/by-role/${targetRole}${queryString ? `?${queryString}` : ''}`);
  },

  // Get all notifications for current user
  getAll: async (params?: { page?: number; limit?: number; isRead?: boolean }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.isRead !== undefined) queryParams.append('isRead', params.isRead.toString());

    const queryString = queryParams.toString();
    return apiRequest(`/notifications${queryString ? `?${queryString}` : ''}`);
  },

  // Mark notification as read
  markAsRead: async (id: string) => {
    return apiRequest(`/notifications/${id}/read`, { method: 'PUT' });
  },

  // Update notification status (approved/rejected)
  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/notifications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Create/Send a notification to a specific user
  send: async (data: { userId: string; title: string; message: string; type: string; priority: string; actionUrl?: string; metadata?: any }) => {
    return apiRequest('/notifications/send', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Broadcast notification to multiple users
  broadcast: async (data: { userIds: string[]; title: string; message: string; type: string; priority: string; actionUrl?: string; metadata?: any }) => {
    return apiRequest('/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

export default {
  schemeAPI,
  documentAPI,
  notificationAPI,
  authAPI,
};

