export interface DataManager {
  login(email: string, password: string): Promise<string>;
  getRootFolder(operationToken: string): Promise<any[]>;
  getFolder(operationToken: string, folderId: string | null): Promise<any>;
}
