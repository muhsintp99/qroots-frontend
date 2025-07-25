// import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';
// import NavGroup from './NavGroup';
// import menuItem from 'menu-items';

// export default function Navigation() {
//   const navGroups = menuItem.items.map((item) => {
//     switch (item.type) {
//       case 'group':
//         return <NavGroup key={item.id} item={item} />;
//       default:
//         return (
//           <Typography key={item.id} variant="h6" color="error" align="center">
//             Fix - Navigation Group
//           </Typography>
//         );
//     }
//   });

//   return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
// }

//----------------------------------------------------------------------------------------------------

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SideMenu } from '../../../../../utils/sideMenu';
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

export default function Navigation() {
  const userData = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const userType = userData?.user?.userType || 'guest';

  const menuList = SideMenu({ role: userType }, menuItem);

  if (!menuList.length) {
    return (
      <Box sx={{ pt: 2 }}>
        <Typography variant="h6" color="error" align="center">
          No menu items available
        </Typography>
      </Box>
    );
  }

  const navGroups = menuList.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}