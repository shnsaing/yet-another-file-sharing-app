import { Button } from 'antd';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import './style.less';

const HomePage: FC = () => {
  return (
    <div className="home-container">
      Bienvenue sur Kiken.
      <Button>
        <Link to="/login">Se connecter</Link>
      </Button>
    </div>
  );
};

export default HomePage;
