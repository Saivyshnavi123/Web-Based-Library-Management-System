import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const auth = isAuthenticated();

  return auth ? children : <Navigate to="/" />;
}; 

const isAuthenticated = () => {
  return !!sessionStorage.getItem('token');
};

export default ProtectedRoute;