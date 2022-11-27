import React, { useState } from 'react';
import { Drawer, Layout, Menu, MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { WithTranslation } from 'react-i18next';
import { MenuOutlined } from '@ant-design/icons';

import withTranslation from '../../hoc/withTranslation';

import './style.less';

const { Header } = Layout;

const Navbar: React.FC = ({ t }: WithTranslation) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();

  const getMenu = () => {
    const menu: MenuProps['items'] = [];
    menu.push({
      label: t('home'),
      key: '/',
    });
    if (sessionStorage.getItem('token')) {
      menu.push(
        {
          label: 'Administration',
          key: '/admin/users',
        },
        {
          label: t('menu.logout'),
          key: '/logout',
        }
      );
    } else {
      menu.push({
        label: t('menu.login'),
        key: '/login',
      });
    }
    return menu;
  };

  const menuOnClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
    setOpenDrawer(false);
  };

  const getDrawer = () => {
    return (
      <Drawer
        open={openDrawer}
        placement="right"
        title={null}
        closable={false}
        onClose={() => setOpenDrawer(false)}
        drawerStyle={{ overflowX: 'hidden' }}
        width={260}
      >
        <Menu
          defaultSelectedKeys={['/']}
          onClick={menuOnClick}
          mode="vertical"
          items={getMenu()}
        />
      </Drawer>
    );
  };

  return (
    <Header>
      <div className="logo" />
      <div className="hamburger-wrapper">
        <MenuOutlined
          className="hamburger"
          onClick={() => setOpenDrawer(true)}
        />
      </div>
      {getDrawer()}
      {/* {getMenu()} */}
    </Header>
  );
};

export default withTranslation(Navbar);
