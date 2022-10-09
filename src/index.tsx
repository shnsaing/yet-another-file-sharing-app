import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import DataManagerProvider from './services/DataManagerProvider';
import { MockDataManager } from './services/MockDataManager';

import './antd.less';
import { DefaultDataManager } from './services/DefaultDataManager';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

//const dataManager = new MockDataManager();
const dataManager = new DefaultDataManager('https://kiken-qr.com');

root.render(
  <React.StrictMode>
    <DataManagerProvider dataManager={dataManager}>
      <App />
    </DataManagerProvider>
  </React.StrictMode>
);
