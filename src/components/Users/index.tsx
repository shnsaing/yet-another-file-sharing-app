import { Button, Dropdown, Popconfirm, Table, Tag, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import React, { FC, useEffect, useReducer, useState } from 'react';
import { WithTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import withDataManager, {
  WithDataManagerProps,
} from '../../hoc/withDataManager';
import withTranslation from '../../hoc/withTranslation';
import { Role } from '../../services/auth/auth';
import { getFormattedDate } from '../../services/utils';
import Modal from '../Modal';
import ModalForm from '../Modal/ModalForm';
import User from './User';
import { useTablePageSize } from '../../hooks/useTablePageSize';

import '../../style.less';

interface UserType extends User {
  key: React.Key;
}

enum Action {
  CLOSE_MODAL,
  CREATE,
  UPDATE,
  DELETE,
}

const UsersPage: FC<WithTranslation & WithDataManagerProps> = ({
  dataManager,
  t,
}) => {
  const pageSize = useTablePageSize();
  const [paddingTop, setPaddingTop] = useState(56);

  const getUsers = async () => {
    const users = await dataManager.getUsers();
    return users.map((user, i) => {
      return Object.assign(user, { key: i });
    });
  };

  const {
    data: users,
    isFetching,
    refetch,
  } = useQuery(['users'], getUsers, {
    onError: (e) => {
      console.error(e);
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (users) {
      setPaddingTop(users.length > pageSize ? 0 : 56);
    }
  }, [users, pageSize]);

  const [modalFormData, setModalFormData] = useState<any | null>(null);

  const handleFormValues = (changedValues: any, allValues: any) => {
    setModalFormData(allValues);
  };

  const modalReducer = (prevState: any, action: any) => {
    switch (action.type) {
      case Action.CREATE:
        return {
          action: Action.CREATE,
          content: (
            <ModalForm
              inputs={[
                { name: 'email' },
                { name: 'roles', possibleValues: Object.values(Role) },
                { name: 'password' },
              ]}
              onFormValueChange={handleFormValues}
            />
          ),
          showModal: true,
        };
      case Action.UPDATE:
        return {
          action: Action.UPDATE,
          content: (
            <ModalForm
              inputs={[
                { name: 'email', value: action.user.email },
                {
                  name: 'roles',
                  values: action.user.roles,
                  possibleValues: Object.values(Role),
                },
                { name: 'password' },
              ]}
              onFormValueChange={handleFormValues}
            />
          ),
          showModal: true,
        };
      case Action.DELETE:
        return {
          action: Action.DELETE,
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

  const columns: ColumnsType<UserType> = [
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      ellipsis: {
        showTitle: false,
      },
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (value) => (
        <Tooltip placement="bottomLeft" title={value}>
          {value}
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
      key: 'role',
      title: t('user.roles'),
      dataIndex: 'roles',
      responsive: ['md'],
      filters: [
        {
          text: Role.ADMIN,
          value: Role.ADMIN,
        },
        {
          text: Role.CLIENT,
          value: Role.CLIENT,
        },
        {
          text: Role.USER,
          value: Role.USER,
        },
      ],
      onFilter: (value: string, record) =>
        !!record.roles.find((role) => role === value),
      render: (value) => {
        return value.map((role: Role, i: number) => (
          <Tag key={i}>{t(role)}</Tag>
        ));
      },
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (value, record) => (
        <>
          <EditOutlined
            className="edit"
            onClick={() => {
              modalDispatch({
                type: Action.UPDATE,
                user: record,
              });
            }}
          />
          <Popconfirm
            title={t('confirm.title')}
            okText={t('confirm.ok')}
            cancelText={t('confirm.cancel')}
            onConfirm={() => refetch()}
          >
            <UserDeleteOutlined className="delete" />
          </Popconfirm>
        </>
      ),
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
        case Action.CREATE:
          refetch();
          break;
        case Action.UPDATE:
          refetch();
          break;
        case Action.DELETE:
          refetch();
          break;
      }
    }
    hideModal();
  };

  const items: MenuProps['items'] = [
    {
      label: (
        <div
          onClick={() => {
            modalDispatch({
              type: Action.CREATE,
            });
          }}
        >
          <UserAddOutlined /> {t('user.new')}
        </div>
      ),
      key: 'new_user',
    },
  ];

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<UserType>,
    extra: { currentDataSource: []; action: any }
  ) => {
    if (extra.currentDataSource.length > pageSize) {
      setPaddingTop(0);
    } else {
      setPaddingTop(56);
    }
  };

  return (
    <div className="users-container">
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
        dataSource={users}
        scroll={{ x: '100%' }}
        loading={isFetching}
        pagination={{
          pageSize: pageSize,
          hideOnSinglePage: true,
          position: ['topRight'],
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

export default withTranslation(withDataManager(UsersPage));
