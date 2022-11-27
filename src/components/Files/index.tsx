import {
  Button,
  Dropdown,
  Popconfirm,
  Table,
  Tag,
  Tooltip,
  Upload,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  FileImageOutlined,
  FileOutlined,
  FolderAddOutlined,
  FolderOutlined,
  PlusOutlined,
  QrcodeOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import React, { FC, useEffect, useReducer, useState } from 'react';
import { WithTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { Link, useLocation, useParams } from 'react-router-dom';

import withDataManager, {
  WithDataManagerProps,
} from '../../hoc/withDataManager';
import withTranslation from '../../hoc/withTranslation';
import Modal from '../CustomModal';
import ModalForm from './ModalForm';
import type File from './File';
import { Type } from './File';
import {
  getFormattedDate,
  showErrorNotification,
  showSuccesNotification,
} from '../../services/utils';

import '../../style.less';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';

enum Action {
  CLOSE_MODAL,
  DELETE_FILE,
  EDIT_ACCESS,
  EDIT_FILENAME,
  NEW_FOLDER,
  SHOW_FILE,
  SHOW_QRCODE,
}

interface FileType extends File {
  key: React.Key;
  path: string;
  type: string;
  extension?: string;
}

const FilesPage: FC<WithTranslation & WithDataManagerProps> = ({
  dataManager,
  t,
}) => {
  const params = useParams();
  const operationToken = params.operationToken as string;
  const folderId = params.folderId;

  const [pageSize, setPageSize] = useState(7);
  const [paddingTop, setPaddingTop] = useState(56);
  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >({});

  const getExtension = (path: string) => {
    const split = path.split('.');
    return split[split.length - 1];
  };

  const getFolders = async () => {
    let folder;
    try {
      if (folderId) {
        folder = await dataManager.getFolder(operationToken, folderId);
      } else {
        folder = (await dataManager.getRootFolder(operationToken))[0];
      }
      let i = 1;
      const folders = folder.subfolders.map((folder: FileType) => {
        const path = `/${operationToken}/folder/${folder.id}`;
        return Object.assign(folder, { key: i++, type: Type.FOLDER, path });
      });
      const files = folder.mediaObjects.map((file: FileType) => {
        const type =
          Type[
            (file.extension
              ? file.extension.toLowerCase()
              : getExtension(file.path)) as keyof typeof Type
          ] || Type.FILE;
        const path = `/media_objects/${file.path}`;
        return Object.assign(file, { key: i++, name: file.path, type, path });
      });
      const data = folders.concat(files);
      setPaddingTop(data.length > pageSize ? 0 : 56);
      return { root: folder.id, data };
    } catch (error) {
      console.error(error);
      return { root: folder ? folder.id : null, data: [] };
    }
  };

  const {
    data: folders,
    isFetching,
    refetch,
  } = useQuery(['folders'], getFolders, {
    onError: (e) => {
      console.error(e);
    },
    refetchOnWindowFocus: false,
  });

  let location = useLocation();

  useEffect(() => {
    refetch();
  }, [location]);

  const getFileIcon = (type: Type) => {
    switch (type) {
      case Type.FOLDER:
        return <FolderOutlined />;
      case Type.FILE:
        return <FileImageOutlined />;
      default:
        return <FileOutlined />;
    }
  };

  const [modalFormData, setModalFormData] = useState<any | null>(null);

  const handleFormValues = (changedValues: any, allValues: any) => {
    setModalFormData(allValues);
  };

  const modalReducer = (prevState: any, action: any) => {
    switch (action.type) {
      case Action.DELETE_FILE:
        return {
          showModal: true,
        };
      case Action.EDIT_ACCESS:
        return {
          action: Action.EDIT_ACCESS,
          showModal: true,
        };
      case Action.EDIT_FILENAME:
        return {
          action: Action.EDIT_FILENAME,
          content: (
            <ModalForm
              inputs={[{ name: 'name', value: action.file.name }]}
              onFormValueChange={handleFormValues}
            />
          ),
          showModal: true,
        };
      case Action.NEW_FOLDER:
        return {
          action: Action.NEW_FOLDER,
          content: (
            <ModalForm
              inputs={[{ name: 'directoryName' }]}
              onFormValueChange={handleFormValues}
            />
          ),
          showModal: true,
        };
      case Action.SHOW_QRCODE:
        return {
          content: <QRCodeSVG value={action.qrCodeValue} />,
          showModal: true,
        };
      case Action.SHOW_FILE:
        return {
          content: (
            <img
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
              src={action.imageFile}
            />
          ),
          showModal: true,
        };
      case Action.CLOSE_MODAL:
      default:
        setModalFormData(null);
        return {
          content: null,
          showModal: false,
        };
    }
  };

  const [modalState, modalDispatch] = useReducer(modalReducer, {
    content: null,
    showModal: false,
  });

  const onFilenameClick = (file: FileType) => {
    dataManager
      .downloadFile(operationToken, file.id)
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        if (blob.type.indexOf('image') > -1) {
          modalDispatch({
            type: Action.SHOW_FILE,
            imageFile: url,
          });
        } else {
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => {
            window.URL.revokeObjectURL(url); // Delay revoking the ObjectURL for Firefox
          }, 100);
        }
      })
      .catch(console.error);
  };

  const getNameComponent = (record: FileType) => {
    if (record['@type'] === Type.FOLDER) {
      return (
        <Link onClick={() => setFilteredInfo({})} to={record.path}>
          {record.name}
        </Link>
      );
    }
    return <a onClick={() => onFilenameClick(record)}>{record.name}</a>;
  };

  const deleteFile = (file: FileType) => {
    let promise;
    if (file['@type'] === Type.FOLDER) {
      promise = dataManager.deleteFolder(operationToken, file);
    } else {
      promise = dataManager.deleteFile(operationToken, file);
    }
    promise
      .then(() => {
        showSuccesNotification('resourceDeleted', t);
        refetch();
      })
      .catch((e) => showErrorNotification(e, t));
  };

  const columns: ColumnsType<FileType> = [
    {
      key: 'name',
      title: t('name'),
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (value, record) => (
        <Tooltip placement="bottomLeft" title={record.name}>
          {getFileIcon(record['@type'])} {getNameComponent(record)}
        </Tooltip>
      ),
    },
    {
      key: 'createdAt',
      title: t('createdAt'),
      dataIndex: 'createdAt',
      responsive: ['md'],
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: getFormattedDate,
    },
    {
      key: 'updatedAt',
      title: t('updatedAt'),
      dataIndex: 'updatedAt',
      responsive: ['md'],
      sorter: (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      render: getFormattedDate,
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'type',
      responsive: ['md'],
      filters: [
        {
          text: t(`type.${Type.FOLDER.toLowerCase()}`),
          value: Type.FOLDER,
        },
        {
          text: t(`type.${Type.FILE.toLowerCase()}`),
          value: Type.FILE,
        },
      ],
      filteredValue: filteredInfo.type || null,
      onFilter: (value: string, record) => value === record.type,
      render: (value) => (
        <Tag>{t(`type.${value.toLowerCase()}`, value.toLowerCase())}</Tag>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value, record) => (
        <>
          <QrcodeOutlined
            onClick={() => {
              modalDispatch({
                type: Action.SHOW_QRCODE,
                qrCodeValue: `${window.location.origin}/${operationToken}/folder/${record.id}`,
              });
            }}
          />
          <UserOutlined
            className="access"
            onClick={() => {
              modalDispatch({
                type: Action.EDIT_ACCESS,
              });
            }}
          />
          <EditOutlined
            className="edit"
            onClick={() => {
              modalDispatch({
                type: Action.EDIT_FILENAME,
                file: record,
              });
            }}
          />
          <Popconfirm
            title={t('confirm.title')}
            okText={t('confirm.ok')}
            cancelText={t('confirm.cancel')}
            onConfirm={() => deleteFile(record)}
          >
            <DeleteOutlined className="delete" />
          </Popconfirm>
        </>
      ),
    },
  ];

  const fileUpload = (options: any) => {
    const data = new FormData();
    data.set('operationID', operationToken);
    data.set('folderID', folders?.root);
    data.set('file', options.file, options.file.name);
    data.set('name', options.file.name);
    dataManager
      .uploadFile(data)
      .then(() => {
        showSuccesNotification('fileImported', t);
        refetch();
      })
      .catch((e) => {
        console.error(e);
        showErrorNotification(e, t);
      });
  };

  const items: MenuProps['items'] = [
    {
      label: (
        <div
          onClick={() => {
            modalDispatch({
              type: Action.NEW_FOLDER,
            });
          }}
        >
          <FolderAddOutlined /> {t('folder.new')}
        </div>
      ),
      key: 'folder',
    },
    { type: 'divider' },
    {
      label: (
        <Upload showUploadList={false} customRequest={fileUpload}>
          <UploadOutlined /> {t('file.upload')}
        </Upload>
      ),
      key: 'file',
    },
  ];

  const hideModal = () => {
    modalDispatch({
      type: Action.CLOSE_MODAL,
    });
  };

  const modalOnOk = async () => {
    if (modalState.action && modalFormData) {
      switch (modalState.action) {
        case Action.EDIT_ACCESS:
          refetch();
          break;
        case Action.EDIT_FILENAME:
          refetch();
          break;
        case Action.NEW_FOLDER:
          try {
            await dataManager.createDirectory(operationToken, {
              name: modalFormData.directoryName,
              parent: folders?.root,
            });
            refetch();
          } catch (e) {
            showErrorNotification(e, t);
          }
          break;
      }
    }
    hideModal();
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<FileType>,
    extra: { currentDataSource: []; action: any }
  ) => {
    setFilteredInfo(filters);
    if (extra.currentDataSource.length > pageSize) {
      setPaddingTop(0);
    } else {
      setPaddingTop(56);
    }
  };

  return (
    <div className="files-container">
      <Dropdown
        className="actions-container"
        menu={{ items }}
        trigger={['click']}
      >
        <Button size="small" icon={<PlusOutlined />}>
          {t('new')}
        </Button>
      </Dropdown>
      <Table
        style={{ paddingTop }}
        columns={columns}
        dataSource={folders?.data}
        scroll={{ x: '100%' }}
        loading={isFetching}
        pagination={{
          pageSize: pageSize,
          hideOnSinglePage: true,
          position: ['topRight', 'bottomRight'],
        }}
        locale={{ emptyText: t('nodata') }}
        size="middle"
        onChange={handleTableChange}
        showSorterTooltip={false}
      />
      <Modal
        showModal={modalState.showModal}
        onOk={modalOnOk}
        onCancel={hideModal}
      >
        {modalState.content}
      </Modal>
    </div>
  );
};

export default withTranslation(withDataManager(FilesPage));
