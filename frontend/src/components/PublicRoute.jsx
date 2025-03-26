import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const PublicRoute = ({ children }) => {
  const [user] = useAuthState(auth);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
