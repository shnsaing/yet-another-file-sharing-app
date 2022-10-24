import { Table, Tag } from 'antd';
import { FolderOutlined, QrcodeOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect } from 'react';
import { WithTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

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

  const showQrCode = (id: string) => {};

  const getFolders = async () => {
    const operationToken = params.operationToken;
    const folderId = params.folderId;
    console.log(params);
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
      console.log(data);
      return data.map((folder: FolderType, i: number) => {
        return Object.assign({ key: i }, folder);
      });
    }
    throw new Error('No operationToken of id provided');
  };

  const {
    data: folders,
    isFetching,
    status,
    error,
    refetch,
  } = useQuery(['folders'], getFolders);

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
          <Link to={`/${params.operationToken}/folder/${record.id}`}>
            {value}
          </Link>
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
        scroll={{ x: '100vw', y: '300' }}
      />
    </>
  );
};

export default withTranslation(withDataManager(FoldersPage));
