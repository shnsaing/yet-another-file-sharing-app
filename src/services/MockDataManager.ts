import { DataManager } from './DataManager';

export class MockDataManager implements DataManager {
  async login(email: string, password: string): Promise<any> {
    return 'mocktoken';
  }
}
