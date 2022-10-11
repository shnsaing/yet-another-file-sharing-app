import { Table, Tag } from 'antd';
import { FolderOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useState } from 'react';
import { WithTranslation } from 'react-i18next';
import { useLocation, useRoute } from 'wouter';

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

const HomePage: FC<WithTranslation & WithDataManagerProps> = ({
  dataManager,
  t,
}) => {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute('/:code');

  const [folders, setFolders] = useState<FolderType[]>([]);

  const fetchFolders = async (code: string) => {
    const folders = await dataManager.getFolders(code);
    return setFolders(folders);
  };

  useEffect(() => {
    const code = (params as any).code;
    if (code) {
      fetchFolders(code).catch(console.error);
    }
  }, []);

  const columns: ColumnsType<FolderType> = [
    {
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
      title: 'Créé le',
      dataIndex: 'createdAt',
      responsive: ['md'],
    },
    {
      title: 'Type',
      dataIndex: 'type',
      responsive: ['md'],
      render: (value) => {
        return <Tag>{t(`type.${value}`)}</Tag>;
      },
    },
    {
      title: 'QR Code',
    },
    {},
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

export default withTranslation(withDataManager(withDefaultLayout(HomePage)));
