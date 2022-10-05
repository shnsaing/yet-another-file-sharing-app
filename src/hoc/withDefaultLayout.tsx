import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const withDefaultLayout = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithDefaultLayout = (props: P) => {
    return (
      <div>
        <Navbar />
        <WrappedComponent {...props} />
        <Footer />
      </div>
    );
  };

  ComponentWithDefaultLayout.displayName = `withDefaultLayout(${displayName})`;

  return ComponentWithDefaultLayout;
};

export default withDefaultLayout;
