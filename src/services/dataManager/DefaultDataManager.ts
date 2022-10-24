import { DataManager } from './DataManager';

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
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.token;
    } else {
      throw new Error();
    }
  }

  async getFolders(operationToken: string, sessionToken: string): Promise<any> {
    const response = await fetch(
      this.getUrlWithQueryParams(
        `${this.baseUrl}/api/${operationToken}/folders`,
        { root: true }
      ),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          // Authorization: `Bearer ${sessionToken}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error();
    }
  }
}
