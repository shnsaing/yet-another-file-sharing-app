import React, { FC, useEffect, useState } from 'react';
import { Button, Card, Divider, Form, Input, notification, Row } from 'antd';
import { WithTranslation } from 'react-i18next';
import { useLocation, Link } from 'wouter';

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
  const [location, setLocation] = useLocation();
  const [form] = Form.useForm();

  console.log(t('test'));
  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      setLocation('/');
    }
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const token = await dataManager.login(values.email, values.password);
      sessionStorage.setItem('token', token);
      setLocation('/');
    } catch (_) {
      form.resetFields();
      notification.error({
        message: 'Erreur',
        description:
          "Votre compte n'a pas été retrouvé. Veuillez vérifier les informations et réessayer.",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateMessages = {
    required: 'Veuillez renseigner votre ${name} !',
    types: {
      email: 'Veuillez renseigner un email valide !',
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
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            messageVariables={{ name: 'mot de passe' }}
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="Mot de passe" />
          </Form.Item>

          <Row justify="center">
            <Button type="primary" htmlType="submit" loading={loading}>
              Se connecter
            </Button>
            <Divider />
            <Link href="/forgot-password" className="active">
              Mot de passe oublié ?
            </Link>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default withTranslation(withDataManager(LoginPage));
