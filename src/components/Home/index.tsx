import React, { FC, useEffect } from 'react';
import { useLocation } from 'wouter';
import withDefaultLayout from '../../hoc/withDefaultLayout';

const HomePage: FC = () => {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      setLocation('/login');
    }
  }, []);

  return <>Home</>;
};

export default withDefaultLayout(HomePage);
