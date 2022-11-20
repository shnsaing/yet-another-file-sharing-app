import { DataManager } from './DataManager';

class HeadersFactory {
  private static buildHeaders = () => {
    const headers = new Headers();
    const token = sessionStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  };

  private static buildDefaultHeaders = () => {
    const headers = HeadersFactory.buildHeaders();
    headers.set('Accept', 'application/json');
    return headers;
  };

  static buildGetHeaders = () => {
    return HeadersFactory.buildDefaultHeaders();
  };

  static buildGetStreamHeaders = () => {
    const headers = HeadersFactory.buildHeaders();
    headers.set('Accept', 'application/octet-stream');
    return headers;
  };

  static buildPostHeaders = () => {
    const headers = HeadersFactory.buildDefaultHeaders();
    headers.set('Content-Type', 'application/json');
    return headers;
  };

  static buildDeleteHeaders = () => {
    return HeadersFactory.buildDefaultHeaders();
  };
}

export class DefaultDataManager implements DataManager {
  private readonly baseUrl;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getUrlWithQueryParams = (baseUrl: string, queryParams = {}) => {
    const url = new URL(baseUrl);
    if (Object.keys(queryParams).length > 0) {
      Object.entries(queryParams).forEach(([key, val]) => {
        url.searchParams.append(key, val ? val.toString() : '');
      });
    }
    return url;
  };

  async login(email: string, password: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/authentication_token`, {
      method: 'POST',
      headers: HeadersFactory.buildPostHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.token;
    } else {
      throw new Error();
    }
  }

  async getRootFolder(operationToken: string): Promise<any[]> {
    const response = await fetch(
      this.getUrlWithQueryParams(
        `${this.baseUrl}/api/${operationToken}/folders`,
        { root: true }
      ),
      {
        method: 'GET',
        headers: HeadersFactory.buildGetHeaders(),
      }
    );
    if (response.ok) {
      return await response.json();
    }
    throw new Error(response.statusText);
  }

  async getFolder(operationToken: string, folderId: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/api/${operationToken}/folders/${folderId}`,
      {
        method: 'GET',
        headers: HeadersFactory.buildGetHeaders(),
      }
    );
    if (response.ok) {
      return await response.json();
    }
    throw new Error(response.statusText);
  }

  async downloadFile(operationToken: string, fileId: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/api/${operationToken}/download/${fileId}`,
      {
        method: 'GET',
        headers: HeadersFactory.buildGetStreamHeaders(),
      }
    );
    if (response.ok) {
      return await response.blob();
    }
    throw new Error(response.statusText);
  }

  async uploadFile(data: FormData): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/media_objects`, {
      method: 'POST',
      body: data,
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error(response.statusText);
  }

  async deleteFile(operationToken: string, fileId: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/api/media_objects/${fileId}`,
      {
        method: 'DELETE',
        headers: HeadersFactory.buildDeleteHeaders(),
      }
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }

  async deleteFolder(operationToken: string, folderId: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/api/${operationToken}/folders/${folderId}`,
      {
        method: 'DELETE',
        headers: HeadersFactory.buildDeleteHeaders(),
      }
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }

  async createDirectory(operationToken: string, data: any): Promise<any> {
    const { name, parent } = data;
    const response = await fetch(`${this.baseUrl}/api/folders`, {
      method: 'POST',
      headers: HeadersFactory.buildPostHeaders(),
      body: JSON.stringify({ name, parent, operation: operationToken }),
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error(response.statusText);
  }
}
