export interface DataManager {
  login(email: string, password: string): Promise<string>;
  getRootFolder(operationToken: string): Promise<any[]>;
  getFolder(operationToken: string, folderId: string | null): Promise<any>;
  downloadFile(operationToken: string, fileId: string): Promise<any>;
  uploadFile(data: FormData): Promise<any>;
  deleteFile(operationToken: string, fileId: string): Promise<any>;
  deleteFolder(operationToken: string, folderId: string): Promise<any>;
  createDirectory(operationToken: string): Promise<any>;
}
