import type File from '../../components/Files/File';

export interface DataManager {
  login(email: string, password: string): Promise<any>;
  getRootFolder(operationToken: string): Promise<any[]>;
  getFolder(operationToken: string, folderId: string | null): Promise<any>;
  downloadFile(operationToken: string, fileId: string): Promise<any>;
  uploadFile(data: FormData): Promise<any>;
  deleteFile(operationToken: string, file: File): Promise<any>;
  deleteFolder(operationToken: string, folder: File): Promise<any>;
  createDirectory(operationToken: string, data: any): Promise<any>;
}
