import apiClient, { setAuthToken, removeAuthToken } from "@/lib/api-client";

export interface RegisterPayload {
  email: string;
  password: string;
  groupName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  account: {
    id: number;
    email: string;
    groupName: string;
  };
}

export interface UserProfileResponse {
  account: {
    id: number;
    email: string;
    groupName: string;
    createdAt: string;
    profiles: Array<{
      id: number;
      name: string;
      pinCode?: string;
    }>;
  };
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", payload);
    if (response.data.accessToken) {
      setAuthToken(response.data.accessToken);
    }
    return response.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", payload);
    if (response.data.accessToken) {
      setAuthToken(response.data.accessToken);
    }
    return response.data;
  },

  async getMe(): Promise<UserProfileResponse> {
    const response = await apiClient.get<UserProfileResponse>("/auth/me");
    return response.data;
  },

  logout(): void {
    removeAuthToken();
  },
};
