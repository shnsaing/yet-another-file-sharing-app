export interface DataManager {
  login(email: string, password: string): Promise<any>;
}
