import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { loginSuccess } from '../container/LoginContainer/slice';
import { useEffect } from 'react';

const AuthGuard = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = JSON.parse(localStorage.getItem('adminUser'));

   useEffect(() => {
    if (isAuthenticated) {
      dispatch(loginSuccess(isAuthenticated));
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthGuard;
// -----------------------------------------------------------------------------------------------------

// import { Navigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { loginSuccess } from '../container/LoginContainer/slice';
// import { useEffect } from 'react';

// const AuthGuard = ({ children }) => {
//   const dispatch = useDispatch();
//   const isAuthenticated = JSON.parse(localStorage.getItem('userData')); // changed from adminUser

//   useEffect(() => {
//     if (isAuthenticated) {
//       dispatch(loginSuccess(isAuthenticated));
//     }
//   }, [dispatch, isAuthenticated]);

//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// };

// export default AuthGuard;
