import { AxiosInstance } from 'axios';

import { DataManager } from './DataManager';
import type File from '../../components/Files/File';
import User from '../../components/Users/User';

export class DefaultDataManager implements DataManager {
  private readonly axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const response: any = await this.axios.post('/authentication_token', {
        email,
        password,
      });
      return {
        token: response.data.token,
        refreshToken: response.data.refresh_token,
        role: response.data.role,
      };
    } catch (err) {
      throw new Error(err.response.statusText);
    }
  }

  async getRootFolder(operationToken: string): Promise<any[]> {
    try {
      const response: any = await this.axios.get(
        `/api/${operationToken}/folders`,
        {
          params: { root: true },
        }
      );
      return response.data['hydra:member'];
    } catch (err) {
      throw new Error(err.response.statusText);
    }
  }

  async getFolder(operationToken: string, folderId: string): Promise<any> {
    try {
      const response: any = await this.axios.get(
        `/api/${operationToken}/folders/${folderId}`
      );
      return response.data;
    } catch (err) {
      throw new Error(err.response.statusText);
    }
  }

  async downloadFile(operationToken: string, fileId: string): Promise<any> {
    try {
      const response = await this.axios.get(
        `/api/${operationToken}/download/${fileId}`,
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(err.response.statusText);
    }
  }

  async uploadFile(data: FormData): Promise<any> {
    try {
      await this.axios.post('/api/media_objects', data);
      return true;
    } catch (err) {
      throw new Error(err.response.statusText);
    }
  }

  async deleteFile(operationToken: string, file: File): Promise<any> {
    try {
      const response = await this.axios.delete(
        `/api/${operationToken}/media_objects/${file['id']}`
      );
      console.log(response);
    } catch (err) {
      throw new Error(err.response.statusText);
    }
  }

  async deleteFolder(operationToken: string, folder: File): Promise<any> {
    try {
      const response = await this.axios.delete(
        `/api/${operationToken}/folders/${folder.id}`
      );
      console.log(response);
    } catch (err) {
      throw new Error(err.response.statusText);
    }
  }

  async createDirectory(operationToken: string, data: any): Promise<any> {
    try {
      const { name, parent } = data;
      const response = await this.axios.post('/api/folders', {
        name,
        parent,
        operation: operationToken,
      });
      console.log(response);
    } catch (err) {
      throw new Error(err.response.statusText);
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const response: any = await this.axios.get('/api/users');
      return response.data['hydra:member'];
    } catch (err) {
      throw new Error(err.response.statusText);
    }
  }
}
