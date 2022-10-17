import { Button } from 'antd';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const HomePage: FC = () => {
  return (
    <>
      Bienvenue sur Kiken.
      <Button>
        <Link to="/login">Se connecter</Link>
      </Button>
    </>
  );
};

export default HomePage;
