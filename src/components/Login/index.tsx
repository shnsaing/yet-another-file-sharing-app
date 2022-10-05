import React, { FC, useEffect, useState } from 'react';
import { Button, Form, Input, Row } from 'antd';
import { useLocation } from 'wouter';
import withDataManager, {
  WithDataManagerProps,
} from '../../hoc/withDataManager';

import './style.less';

const LoginPage: FC = ({ dataManager }: WithDataManagerProps) => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      setLocation('/');
    }
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    const token = await dataManager.login(values.username, values.password);
    sessionStorage.setItem('token', token);
    setLoading(false);
    setLocation('/');
  };

  return (
    <div className="login-view-container">
      <Form onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Row justify="center">
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );
};

export default withDataManager(LoginPage);
