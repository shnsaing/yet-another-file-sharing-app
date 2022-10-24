import { Table, Tag } from 'antd';
import { FolderOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect } from 'react';
import { WithTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import withDataManager, {
  WithDataManagerProps,
} from '../../hoc/withDataManager';
import withTranslation from '../../hoc/withTranslation';
import { Link, useNavigate, useParams } from 'react-router-dom';

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

  const getFolders = async () => {
    const operationToken = params.operationToken;
    if (operationToken) {
      const folders = await dataManager.getFolders(
        operationToken,
        sessionStorage.getItem('token')
      );
      return folders.map((folder: FolderType, i: number) => {
        return Object.assign({ key: i }, folder);
      });
    }
    throw new Error('No operationToken provided');
  };

  const folders = useQuery(['folders'], getFolders);

  const columns: ColumnsType<FolderType> = [
    {
      key: 'name',
      title: 'Nom',
      dataIndex: 'name',
      render: (value, record) => (
        <span>
          <FolderOutlined /> <Link to={`folder/${record.id}`}>{value}</Link>
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
    },
    {
      key: 'actions',
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={folders.data}
        scroll={{ x: '100vw', y: '300' }}
      />
    </>
  );
};

export default withTranslation(withDataManager(FoldersPage));
