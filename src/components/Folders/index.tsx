import { Table, Tag } from 'antd';
import { FolderOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';
import React, { FC } from 'react';
import { WithTranslation } from 'react-i18next';
import { useLocation, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';

import withDataManager, {
  WithDataManagerProps,
} from '../../hoc/withDataManager';
import withDefaultLayout from '../../hoc/withDefaultLayout';
import withTranslation from '../../hoc/withTranslation';

interface FolderType {
  key: React.Key;
  name: string;
  createdAt: Date;
  type: string;
}

const FoldersPage: FC<WithTranslation & WithDataManagerProps> = ({
  dataManager,
  t,
}) => {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute('/:operationToken');

  const getFolders = async () => {
    const operationToken = (params as any).operationToken;
    if (operationToken) {
      const folders = await dataManager.getFolders(operationToken);
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
      render: (value, record, index) => {
        return (
          <>
            <FolderOutlined /> {value}
          </>
        );
      },
    },
    {
      key: 'createdAt',
      title: 'Créé le',
      dataIndex: 'createdAt',
      responsive: ['md'],
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'type',
      responsive: ['md'],
      render: (value) => {
        return <Tag>{t(`type.${value}`)}</Tag>;
      },
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

export default withTranslation(withDataManager(withDefaultLayout(FoldersPage)));
