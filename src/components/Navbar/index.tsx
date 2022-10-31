import React, { useState } from 'react';
import { Drawer, Layout } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { WithTranslation } from 'react-i18next';
import { MenuOutlined } from '@ant-design/icons';

import withTranslation from '../../hoc/withTranslation';

import './style.less';

const { Header } = Layout;

const Navbar: React.FC = ({ t }: WithTranslation) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem('token');
    navigate(0); // refresh the page
  };

  const getMenu = () => {
    const menu: React.ReactElement[] = [];
    if (sessionStorage.getItem('token')) {
      menu.push(<a onClick={() => logout()}>{t('menu.logout')}</a>);
    } else {
      menu.push(<Link to="/login">{t('menu.login')}</Link>);
    }
    return menu;
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
        {getMenu()}
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
