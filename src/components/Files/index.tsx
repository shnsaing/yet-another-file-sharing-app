import { Button, Dropdown, Modal, Table, Tag, Tooltip, Upload } from 'antd';
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
} from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useState } from 'react';
import { WithTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { Link, useLocation, useParams } from 'react-router-dom';

import withDataManager, {
  WithDataManagerProps,
} from '../../hoc/withDataManager';
import withTranslation from '../../hoc/withTranslation';

import './style.less';

enum Type {
  folder = 'folder',
  file = 'file',
  png = 'png',
}

interface FileType {
  key: React.Key;
  id: string;
  name: string;
  createdAt: Date;
  path: string;
  type: Type;
  extension?: string;
}

const FilesPage: FC<WithTranslation & WithDataManagerProps> = ({
  dataManager,
  t,
}) => {
  const params = useParams();
  const operationToken = params.operationToken as string;
  const folderId = params.folderId;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [file, setFile] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(7);

  const showQrCode = (id: string) => {
    setIsModalOpen(true);
    setQrCode(`${window.location.origin}/${operationToken}/folder/${id}`);
  };

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
        return Object.assign(folder, { key: i++, type: Type.folder, path });
      });
      const files = folder.mediaObjects.map((file: FileType) => {
        const type =
          Type[
            (file.extension
              ? file.extension.toLowerCase()
              : getExtension(file.path)) as keyof typeof Type
          ] || Type.file;
        const path = `/media_objects/${file.path}`;
        return Object.assign(file, { key: i++, name: file.path, type, path });
      });
      return { root: folder.id, data: folders.concat(files) };
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
  });

  let location = useLocation();

  useEffect(() => {
    refetch();
  }, [location]);

  const getFileIcon = (type: Type) => {
    switch (type) {
      case Type.folder:
        return <FolderOutlined />;
      case Type.file:
        return <FileImageOutlined />;
      default:
        return <FileOutlined />;
    }
  };

  const onFilenameClick = (file: FileType) => {
    dataManager.downloadFile(operationToken, file.name);
  };

  const getNameComponent = (record: FileType) => {
    if (record.type === Type.folder) {
      return <Link to={record.path}>{record.name}</Link>;
    }
    return <a onClick={() => onFilenameClick(record)}>{record.name}</a>;
  };

  const columns: ColumnsType<FileType> = [
    {
      key: 'name',
      title: 'Nom',
      ellipsis: {
        showTitle: false,
      },
      render: (value, record) => (
        <Tooltip placement="bottomLeft" title={record.name}>
          {getFileIcon(record.type)} {getNameComponent(record)}
        </Tooltip>
      ),
    },
    {
      key: 'createdAt',
      title: 'Créé le',
      dataIndex: 'createdAt',
      responsive: ['md'],
      render: (value) =>
        new Intl.DateTimeFormat('fr', {
          dateStyle: 'short',
          timeStyle: 'medium',
        }).format(new Date(value)),
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'type',
      responsive: ['md'],
      render: (value) => <Tag>{t(`type.${value}`, value)}</Tag>,
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value, record) => (
        <>
          <QrcodeOutlined onClick={() => showQrCode(record.id)} />
          <EditOutlined className="edit" />
          <DeleteOutlined className="delete" />
        </>
      ),
    },
  ];

  const hideModal = () => {
    setIsModalOpen(false);
    setQrCode(null);
    setFile(null);
  };

  const fileUpload = (options: any) => {
    const data = new FormData();
    data.set('operationID', operationToken);
    data.set('folderID', folders?.root);
    data.set('file', options.file, options.file.name);
    data.set('name', options.file.name);
    dataManager.uploadFile(data).then(refetch);
  };

  const items: MenuProps['items'] = [
    {
      label: (
        <Upload showUploadList={false} customRequest={fileUpload} directory>
          <FolderAddOutlined /> {t('folder.new')}
        </Upload>
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
        style={{
          paddingTop: folders && folders.data.length > pageSize ? 0 : 56,
        }}
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
      />
      <Modal
        centered
        open={isModalOpen}
        onOk={hideModal}
        okText="Ok"
        onCancel={hideModal}
        cancelText={t('modal.close')}
        bodyStyle={{ display: 'flex', justifyContent: 'center' }}
      >
        {qrCode && <QRCodeSVG value={qrCode} />}
        {file && <img />}
      </Modal>
    </div>
  );
};

export default withTranslation(withDataManager(FilesPage));
