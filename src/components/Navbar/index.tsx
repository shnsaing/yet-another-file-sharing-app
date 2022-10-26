import React from 'react';
import { Button, Layout, Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const { Header } = Layout;

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem('token');
    navigate(0); // refresh the page
  };

  return (
    <Header>
      <div className="logo" />
      {/*  <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        items={new Array(15).fill(null).map((_, index) => {
          const key = index + 1;
          return {
            key,
            label: `nav ${key}`,
          };
        })}
      /> */}
      <Link to="/login">login</Link>
      <Button onClick={logout}>logout</Button>
    </Header>
  );
};

export default Navbar;
