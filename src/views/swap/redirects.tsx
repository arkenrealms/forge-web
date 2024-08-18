import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function RedirectPathToSwapOnly() {
  const navigate = useNavigate();
  const location = useLocation();

  // Use navigate to redirect while preserving the rest of the location
  React.useEffect(() => {
    navigate('/swap', { replace: true, state: location.state });
  }, [navigate, location]);

  return null; // No need to render anything
}

export default RedirectPathToSwapOnly;
