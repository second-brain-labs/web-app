// useAuth.ts

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setAuth } from '../slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const login = () => {
    // Perform login logic and dispatch setAuth with true
    dispatch(setAuth(true));
  };

  const logout = () => {
    // Perform logout logic and dispatch setAuth with false
    dispatch(setAuth(false));
  };

  return {
    isAuthenticated,
    login,
    logout,
  };
}
