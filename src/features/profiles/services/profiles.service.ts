import apiClient from "@/lib/api-client";

export interface ProfileResponse {
  id: number;
  name: string;
  pinCode?: string;
  accountId?: number;
}

export interface CreateProfilePayload {
  name: string;
  pinCode?: string;
  accountId: number;
}

export interface UpdateProfilePayload {
  name?: string;
  pinCode?: string;
}

export const profilesService = {
  async getByAccount(accountId: number): Promise<ProfileResponse[]> {
    const response = await apiClient.get<
      | ProfileResponse[]
      | { items: ProfileResponse[] }
      | { data: ProfileResponse[] }
    >(`/profiles/account/${accountId}`);

    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (
      response.data &&
      "items" in response.data &&
      Array.isArray(response.data.items)
    ) {
      return response.data.items;
    }
    if (
      response.data &&
      "data" in response.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data;
    }
    return [];
  },

  async create(payload: CreateProfilePayload): Promise<ProfileResponse> {
    const response = await apiClient.post<ProfileResponse>("/profiles", payload);
    return response.data;
  },

  async update(id: number, payload: UpdateProfilePayload): Promise<ProfileResponse> {
    const response = await apiClient.patch<ProfileResponse>(`/profiles/${id}`, payload);
    return response.data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/profiles/${id}`);
    return response.data;
  },
};
