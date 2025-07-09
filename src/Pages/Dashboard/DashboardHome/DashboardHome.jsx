import React from 'react';
import useUserRole from '../../../Hooks/useUserRole';
import BuyerDashHome from './BuyerDashHome/BuyerDashHome';
import WorkerDashHome from './WorkerDashHome/WorkerDashHome';

const DashboardHome = () => {
  const { role } = useUserRole();

    console.log(role);
    

  return (
    <div>
      { role === 'Buyer' && (<BuyerDashHome />)}
      {
        role === 'Worker' &&( <WorkerDashHome></WorkerDashHome>)
      }
    </div>
    
  );
};

export default DashboardHome;
