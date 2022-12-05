import React from 'react';
import { Tabs } from 'antd';
import { ToolOutlined, UserOutlined } from '@ant-design/icons';
import type { WithTranslation } from 'react-i18next';

import UsersTab from './Users';
import OperationsTab from './Operations';
import withTranslation from '../../hoc/withTranslation';

import './style.less';

const AdministrationPage = ({ t }: WithTranslation) => {
  const items = [
    {
      label: (
        <span>
          <UserOutlined />
          {t('admin.usersTab')}
        </span>
      ),
      key: 'users',
      children: <UsersTab inTab={true} />,
    },
    {
      label: (
        <span>
          <ToolOutlined />
          {t('admin.operationsTab')}
        </span>
      ),
      key: 'operations',
      children: <OperationsTab inTab={true} />,
    },
  ];

  return (
    <div className="card-container">
      <Tabs type="card" items={items} />
    </div>
  );
};

export default withTranslation(AdministrationPage);
