import React, { FC, useEffect, useState } from 'react';
import { Button, Card, Divider, Form, Input, notification, Row } from 'antd';
import { WithTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import withTranslation from '../../hoc/withTranslation';
import withDataManager, {
  WithDataManagerProps,
} from '../../hoc/withDataManager';

import './style.less';

const LoginPage: FC = ({
  dataManager,
  t,
}: WithTranslation & WithDataManagerProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      navigate('/');
    }
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { token, refreshToken, role } = await dataManager.login(
        values.email,
        values.password
      );
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('refresh_token', refreshToken);
      sessionStorage.setItem('role', role);
      navigate(-1);
    } catch (e) {
      console.error(e);
      form.resetFields();
      notification.error({
        message: t('error'),
        description: t('login.errorMessage'),
      });
    } finally {
      setLoading(false);
    }
  };

  const validateMessages = {
    required: t('login.invalidInput', { input: '${name}' }),
    types: {
      email: t('email.invalidMessage'),
    },
  };

  return (
    <div className="login-view-container">
      <Card>
        <Form
          form={form}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder={t('email.label')} />
          </Form.Item>

          <Form.Item
            name="password"
            messageVariables={{ name: t('password').toLowerCase() }}
            rules={[{ required: true }]}
          >
            <Input.Password placeholder={t('password')} />
          </Form.Item>

          <Row justify="center">
            <Button type="primary" htmlType="submit" loading={loading}>
              {t('login.submit')}
            </Button>
            <Divider />
            <Link to="/forgot-password" className="active">
              {t('forgotPassword')}
            </Link>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default withTranslation(withDataManager(LoginPage));
