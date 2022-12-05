import React, { FC, useReducer, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Popconfirm, Tag, Tooltip } from 'antd';
import {
  EditOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import type { WithTranslation } from 'react-i18next';

import TableView from '../TableView';
import ModalForm from '../Modal/ModalForm';
import withDataManager, {
  WithDataManagerProps,
} from '../../hoc/withDataManager';
import withTranslation from '../../hoc/withTranslation';
import { ModalAction, Role } from '../../services/auth/auth';
import { getFormattedDate } from '../../services/utils';
import { UserAction as Action } from '../../services/auth/auth';
import type User from '../../types/User';

import '../../style.less';

interface UserType extends User {
  key: React.Key;
}

const UsersPage: FC<
  WithTranslation & WithDataManagerProps & { inTab?: boolean }
> = ({ dataManager, t, inTab }) => {
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

  const [modalFormData, setModalFormData] = useState<any | null>(null);

  const handleFormValues = (changedValues: any, allValues: any) => {
    setModalFormData(allValues);
  };

  const modalReducer = (prevState: any, action: any) => {
    switch (action.type) {
      case Action.CREATE_USER:
        return {
          action: Action.CREATE_USER,
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
      case Action.MODIFY_USER:
        return {
          action: Action.MODIFY_USER,
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
      case Action.DELETE_USER:
        return {
          action: Action.DELETE_USER,
          showModal: true,
        };
      case ModalAction.CLOSE_MODAL:
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
                type: Action.MODIFY_USER,
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
      type: ModalAction.CLOSE_MODAL,
    });
  };

  const modalOnOk = async () => {
    if (modalState.action && modalFormData) {
      switch (modalState.action) {
        case Action.CREATE_USER:
          refetch();
          break;
        case Action.MODIFY_USER:
          refetch();
          break;
        case Action.DELETE_USER:
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
              type: Action.CREATE_USER,
            });
          }}
        >
          <UserAddOutlined /> {t('user.new')}
        </div>
      ),
      key: 'new_user',
    },
  ];

  return (
    <TableView
      data={users}
      isFetching={isFetching}
      actionsItems={items}
      columns={columns}
      formData={modalFormData}
      setFormData={setModalFormData}
      modalOnOkHandler={modalOnOk}
      hideModalHandler={hideModal}
      showModal={modalState.showModal}
      modalContent={modalState.content}
      minusTabSize={inTab}
    />
  );
};

export default withTranslation(withDataManager(UsersPage));
