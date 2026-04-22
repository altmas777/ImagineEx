import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  
  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isAdmin: user?.isAdmin === true
  };
};
