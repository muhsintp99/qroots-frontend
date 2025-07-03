// assets

import { Dashboard, SupervisedUserCircle } from "@mui/icons-material";

// icons
const icons = {
  Dashboard,
  SupervisedUserCircle
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.Dashboard,
      // breadcrumbs: false
    },
    {
      id: 'candidates',
      title: 'Candidates',
      type: 'item',
      url: '/candidates',
      icon: icons.SupervisedUserCircle,
      // breadcrumbs: false
    }
  ]
};

export default dashboard;
