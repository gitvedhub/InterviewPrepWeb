import React, { useContext } from 'react';
import { UserContext } from '../../../../context/userContext'; // ✅ fixed path
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <Navbar />
      {user ? <div>{children}</div> : <p>Loading or not logged in...</p>}
    </div>
  );
};

export default DashboardLayout;
