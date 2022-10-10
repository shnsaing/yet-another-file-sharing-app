import { Card, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import withDataManager, {
  WithDataManagerProps,
} from '../../hoc/withDataManager';
import withDefaultLayout from '../../hoc/withDefaultLayout';

interface FolderType {
  key: React.Key;
  name: string;
  createdAt: Date;
  type: string;
}

const HomePage: FC<WithDataManagerProps> = ({ dataManager }) => {
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
    },
    {
      title: 'Créé le',
      dataIndex: 'createdAt',
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'QR Code',
    },
    {},
  ];

  return (
    <>
      <Card>
        <Table columns={columns} dataSource={folders} />
      </Card>
    </>
  );
};

export default withDataManager(withDefaultLayout(HomePage));
