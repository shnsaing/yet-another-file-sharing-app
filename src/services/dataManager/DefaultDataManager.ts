import { DataManager } from './DataManager';

class HeadersFactory {
  private static buildDefaultHeaders = () => {
    const headers = new Headers();
    headers.set('Accept', 'application/json');
    const token = sessionStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  };

  static buildGetHeaders = () => {
    return HeadersFactory.buildDefaultHeaders();
  };

  static buildPostHeaders = () => {
    const headers = HeadersFactory.buildDefaultHeaders();
    headers.set('Content-Type', 'application/json');
    return headers;
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
}
