import React, { useContext } from 'react';
import { DataManager } from '../services/DataManager';
import { DataManagerContext } from '../services/DataManagerProvider';

interface WithDataManagerProps {
  dataManager: DataManager;
}

const withDataManager = <P extends WithDataManagerProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithDataManager = (
    props: Omit<P, keyof WithDataManagerProps>
  ) => {
    const { dataManager } = useContext(DataManagerContext);

    return <WrappedComponent {...(props as P)} dataManager={dataManager} />;
  };

  ComponentWithDataManager.displayName = `withDataManager(${displayName})`;

  return ComponentWithDataManager;
};

export default withDataManager;
