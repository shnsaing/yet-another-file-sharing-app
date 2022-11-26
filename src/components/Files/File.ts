export enum Type {
  FILE = 'File',
  FOLDER = 'Folder',
}

type File = {
  '@id': string;
  '@type': Type;
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export default File;
