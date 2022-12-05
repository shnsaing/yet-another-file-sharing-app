import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from 'antd';
import type { WithTranslation } from 'react-i18next';

import withTranslation from '../../hoc/withTranslation';

import './style.less';

const { Title, Paragraph } = Typography;

const HomePage: FC<WithTranslation> = ({ t }) => {
  const [appDesc, loginBtn] = sessionStorage.getItem('token')
    ? [t('appDescriptionConnected'), null]
    : [
        t('appDescriptionDisconnected'),
        <Button className="login" type="primary">
          <Link to="/login">{t('menu.login')}</Link>
        </Button>,
      ];

  return (
    <div className="home-container">
      <Typography>
        <Title>{t('welcome')}</Title>
        <Paragraph>{appDesc}</Paragraph>
      </Typography>
      {loginBtn}
    </div>
  );
};

export default withTranslation(HomePage);
