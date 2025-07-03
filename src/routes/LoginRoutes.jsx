import { lazy } from 'react';

// project imports
import AuthLayout from 'layout/Auth';
import Loadable from 'components/Loadable';

// jwt auth
const LoginPage = Loadable(lazy(() => import('pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('pages/auth/Register')));
const EnquiryForm = Loadable(lazy(() => import('pages/view/enquries/EnquiryForm')));
const JobApplication = Loadable(lazy(() => import('pages/view/candidate/JobApplication')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <AuthLayout />,
  children: [
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/register',
      element: <RegisterPage />
    },
    {
      path: '/EnquiryForm',
      element: <EnquiryForm />
    },
    {
      path: '/JobApplication',
      element: <JobApplication />
    }

  ]
};

export default LoginRoutes;
