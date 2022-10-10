import { DataManager } from './DataManager';

export class DefaultDataManager implements DataManager {
  private readonly baseUrl;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

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

  async getFolders(operationToken: string): Promise<any> {
    // TODO: Implement
  }
}
