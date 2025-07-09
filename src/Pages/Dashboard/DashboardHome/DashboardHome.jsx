import React from 'react';
import useUserRole from '../../../Hooks/useUserRole';
import BuyerDashHome from './BuyerDashHome/BuyerDashHome';

const DashboardHome = () => {
  const { role, isLoading } = useUserRole();

  if (isLoading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div>
      {!isLoading && role === 'buyer' && <BuyerDashHome />}
    </div>
  );
};

export default DashboardHome;
