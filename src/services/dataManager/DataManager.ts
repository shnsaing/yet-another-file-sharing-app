export interface DataManager {
  login(email: string, password: string): Promise<any>;
  getFolders(operationToken: string, sessionToken: string | null): Promise<any>;
  getFolder(operationToken: string, folderId: string | null): Promise<any>;
}
