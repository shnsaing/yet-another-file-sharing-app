export interface DataManager {
  login(email: string, password: string): Promise<any>;
  getFolders(operationToken: string): Promise<any>;
}
