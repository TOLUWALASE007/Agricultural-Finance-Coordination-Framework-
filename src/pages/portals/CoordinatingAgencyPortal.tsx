import React from 'react';
import { Navigate } from 'react-router-dom';

const CoordinatingAgencyPortal: React.FC = () => {
  // Redirect immediately to Activities page when user logs into Coordinating Agency
  return <Navigate to="/portal/coordinating-agency/activities" replace />;
};

export default CoordinatingAgencyPortal;
