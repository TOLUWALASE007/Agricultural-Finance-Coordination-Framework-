const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
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
  create: async (schemeData: {
    schemeName: string;
    schemeId: string;
    description: string;
    amount: string;
    states: string[];
    startDate: string;
    applicationDeadline: string;
    fundProvider?: string;
  }) => {
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
  update: async (
    id: string,
    schemeData: {
      schemeName?: string;
      description?: string;
      amount?: string;
      states?: string[];
      startDate?: string;
      applicationDeadline?: string;
      fundProvider?: string;
    }
  ) => {
    return apiRequest(`/schemes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(schemeData),
    });
  },
};

export default {
  schemeAPI,
};

