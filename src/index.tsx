import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import DataManagerProvider from './services/DataManagerProvider';
import { MockDataManager } from './services/MockDataManager';

import './antd.less';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const dataManager = new MockDataManager();

root.render(
  <React.StrictMode>
    <DataManagerProvider dataManager={dataManager}>
      <App />
    </DataManagerProvider>
  </React.StrictMode>
);
