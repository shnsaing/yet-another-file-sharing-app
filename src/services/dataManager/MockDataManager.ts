import { DataManager } from './DataManager';

export class MockDataManager implements DataManager {
  async login(email: string, password: string): Promise<any> {
    return 'mocktoken';
  }

  async getFolders(operationToken: string): Promise<any> {
    return [
      {
        name: 'testFolder',
        createdAt: new Date(),
        type: 'folder',
        files: ['testFile1', 'testFile2'],
      },
    ];
  }

  async getFolder(operationToken: string, folderId: string): Promise<any> {
    // TODO implement
  }
}
