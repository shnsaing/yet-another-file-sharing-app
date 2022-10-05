import { DataManager } from './DataManager';

export class MockDataManager implements DataManager {
  async login(username: string, password: string): Promise<any> {
    return 'mocktoken';
  }
}
