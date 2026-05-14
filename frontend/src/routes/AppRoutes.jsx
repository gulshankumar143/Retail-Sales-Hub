import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Sales from '../pages/Sales';
import Customers from '../pages/Customers';
import Reports from '../pages/Reports';

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={`/overview${location.search}`}
            replace
          />
        }
      />
      <Route path="/overview" element={<Dashboard />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="*" element={<Navigate to={`/overview${location.search}`} replace />} />
    </Routes>
  );
};

export default AppRoutes;
