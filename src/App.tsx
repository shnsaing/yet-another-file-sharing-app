import React, { FC } from 'react';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Routing from './Routing';

const App: FC = () => {
  return (
    <>
      <Navbar />
      <Routing />
      <Footer />
    </>
  );
};

export default App;
