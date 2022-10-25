import { Modal, Table, Tag } from 'antd';
import { FolderOutlined, QrcodeOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useState } from 'react';
import { WithTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';

import withDataManager, {
  WithDataManagerProps,
} from '../../hoc/withDataManager';
import withTranslation from '../../hoc/withTranslation';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

interface FolderType {
  key: React.Key;
  id: string;
  name: string;
  createdAt: Date;
  type: string;
}

const FoldersPage: FC<WithTranslation & WithDataManagerProps> = ({
  dataManager,
  t,
}) => {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (sessionStorage.getItem('token')) {
  //     navigate('/');
  //   }
  // }, []);

  const params = useParams();
  const operationToken = params.operationToken;
  const folderId = params.folderId;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState('');

  const showQrCode = (id: string) => {
    setIsModalOpen(true);
    setQrCode(`${window.location.origin}/${operationToken}/folder/${id}`);
  };

  const getFolders = async () => {
    try {
      if (operationToken) {
        let data;
        if (folderId) {
          const folder = await dataManager.getFolder(operationToken, folderId);
          data = folder.subfolders;
        } else {
          data = await dataManager.getFolders(
            operationToken,
            sessionStorage.getItem('token')
          );
        }
        console.log('data', data);
        return data.map((folder: FolderType, i: number) => {
          return Object.assign({ key: i }, folder);
        });
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
      console.log('test');
      console.error(e);
    },
  });

  let location = useLocation();

  useEffect(() => {
    refetch();
  }, [location]);

  const columns: ColumnsType<FolderType> = [
    {
      key: 'name',
      title: 'Nom',
      dataIndex: 'name',
      render: (value, record) => (
        <span>
          <FolderOutlined />{' '}
          <Link to={`/${operationToken}/folder/${record.id}`}>{value}</Link>
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
      responsive: ['md'],
      render: () => <Tag>{t(`type.folder`)}</Tag>,
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

export default withTranslation(withDataManager(FoldersPage));
