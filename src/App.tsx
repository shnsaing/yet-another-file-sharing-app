import React, { FC } from 'react';
import { Redirect, Route, Switch } from 'wouter';
import FoldersPage from './components/Folders';
import HomePage from './components/Home';
import LoginPage from './components/Login';

const App: FC = () => {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/forgot-password" component={() => <div>forgotpass</div>} />
      <Route path="/home" component={HomePage} />
      <Route path="/:operationToken" component={FoldersPage} />
      <Route path="/" component={() => <Redirect to="/login" />} />
    </Switch>
  );
};

export default App;
