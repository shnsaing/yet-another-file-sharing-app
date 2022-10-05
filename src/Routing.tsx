import React, { FC } from 'react';
import { Route, Switch } from 'wouter';
import HomePage from './components/Home';
import LoginPage from './components/Login';

const Routing: FC = () => {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  );
};

export default Routing;
