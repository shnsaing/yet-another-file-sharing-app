export interface DataManager {
  login(username: string, password: string): Promise<any>;
}
