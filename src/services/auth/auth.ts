export enum Role {
  USER = 'ROLE_USER',
  CLIENT = 'ROLE_ADMIN_CLIENT',
  ADMIN = 'ROLE_ADMIN',
}

export enum FileAction {
  CREATE_FILE,
  CREATE_FOLDER,
  DELETE_FOLDER,
  MODIFY_FOLDER,
}

export enum OperationAction {
  CREATE_OPERATION,
  DELETE_OPERATION,
  MODIFY_OPERATION,
}

export enum UserAction {
  CREATE_USER,
  DELETE_USER,
  MODIFY_USER,
  READ_USER,
}

export type Action = FileAction | OperationAction | UserAction;

const permissions = {
  [FileAction.CREATE_FILE]: [Role.CLIENT, Role.ADMIN],
  [FileAction.CREATE_FOLDER]: [Role.CLIENT, Role.ADMIN],
  [FileAction.DELETE_FOLDER]: [Role.CLIENT, Role.ADMIN],
  [FileAction.MODIFY_FOLDER]: [Role.CLIENT, Role.ADMIN],
  [OperationAction.CREATE_OPERATION]: [Role.CLIENT, Role.ADMIN],
  [OperationAction.DELETE_OPERATION]: [Role.CLIENT, Role.ADMIN],
  [OperationAction.MODIFY_OPERATION]: [Role.CLIENT, Role.ADMIN],
  [UserAction.CREATE_USER]: [Role.ADMIN],
  [UserAction.DELETE_USER]: [Role.ADMIN],
  [UserAction.MODIFY_USER]: [Role.ADMIN],
  [UserAction.READ_USER]: [Role.ADMIN],
};

export default permissions;
