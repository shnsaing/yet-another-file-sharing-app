import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import i18n from './services/i18n/i18n';
import DataManagerProvider from './services/dataManager/DataManagerProvider';
import { MockDataManager } from './services/dataManager/MockDataManager';
import { DefaultDataManager } from './services/dataManager/DefaultDataManager';

import './antd.less';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// const dataManager = new MockDataManager();
const dataManager = new DefaultDataManager('https://kiken-qr.com');

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <Suspense fallback="loading">
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <DataManagerProvider dataManager={dataManager}>
            <App />
          </DataManagerProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </Suspense>
  </React.StrictMode>
);
