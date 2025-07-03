// assets
import {
  // Collections,
  SpaceDashboard,
  Assignment
} from '@mui/icons-material';
// icons
const icons = {
  SpaceDashboard,
  Assignment,
  // Collections,
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Socila Media',
  type: 'group',
  children: [
    {
      id: 'services',
      title: 'Services',
      type: 'item',
      url: '/services',
      icon: icons.Assignment
    },
    {
      id: 'blog',
      title: 'Blog',
      type: 'item',
      url: '/blog',
      icon: icons.SpaceDashboard
    },
    // {
    //   id: 'gallery',
    //   title: 'Gallery',
    //   type: 'item',
    //   url: '/gallery',
    //   icon: icons.Collections
    // }
  ]
};

export default utilities;
