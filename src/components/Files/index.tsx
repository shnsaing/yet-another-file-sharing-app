import { Modal, Table, Tag } from 'antd';
import {
  FileImageOutlined,
  FileOutlined,
  FolderOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useState } from 'react';
import { WithTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';

import withDataManager, {
  WithDataManagerProps,
} from '../../hoc/withDataManager';
import withTranslation from '../../hoc/withTranslation';
import { Link, useLocation, useParams } from 'react-router-dom';

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
  const operationToken = params.operationToken;
  const folderId = params.folderId;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState('');

  const showQrCode = (id: string) => {
    setIsModalOpen(true);
    setQrCode(`${window.location.origin}/${operationToken}/folder/${id}`);
  };

  const getExtension = (path: string) => {
    const split = path.split('.');
    return split[split.length - 1];
  };

  const getFolders = async () => {
    try {
      if (operationToken) {
        let folder;
        if (folderId) {
          folder = await dataManager.getFolder(operationToken, folderId);
        } else {
          folder = (await dataManager.getRootFolder(operationToken))[0];
        }
        const folders = folder.subfolders.map((folder: FileType, i: number) => {
          const path = `/${operationToken}/folder/${folder.id}`;
          return Object.assign(folder, { key: i, type: Type.folder, path });
        });
        const files = folder.mediaObjects.map((file: FileType, i: number) => {
          const type =
            Type[
              (file.extension
                ? file.extension.toLowerCase()
                : getExtension(file.path)) as keyof typeof Type
            ] || Type.file;
          const path = `/media_objects/${file.path}`;
          return Object.assign(file, { key: i, name: file.path, type, path });
        });
        return folders.concat(files);
      }
      throw new Error('No operationToken of id provided');
    } catch (error) {
      console.error(error);
      return [];
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

  const getNameComponent = (record: FileType) => {
    if (record.type === Type.folder) {
      return <Link to={record.path}>{record.name}</Link>;
    }
    return <a onClick={() => {}}>{record.name}</a>;
  };

  const columns: ColumnsType<FileType> = [
    {
      key: 'name',
      title: 'Nom',
      render: (value, record) => (
        <span>
          {getFileIcon(record.type)} {getNameComponent(record)}
        </span>
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
      key: 'qrcode',
      title: 'QR Code',
      render: (value, record) => (
        <QrcodeOutlined onClick={() => showQrCode(record.id)} />
      ),
    },
    {
      key: 'actions',
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={folders}
        scroll={{ x: '100%' }}
        loading={isFetching}
        pagination={{ pageSize: 7, hideOnSinglePage: true }}
        locale={{ emptyText: t('nodata') }}
        size="middle"
      />
      <Modal
        centered
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        okText="Ok"
        onCancel={() => setIsModalOpen(false)}
        cancelText={t('modal.close')}
      >
        <QRCodeSVG value={qrCode} />
      </Modal>
    </>
  );
};

export default withTranslation(withDataManager(FilesPage));
