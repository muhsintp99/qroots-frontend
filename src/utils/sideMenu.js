// export const SideMenu = (user, menu) => {
//   if (!user || !user.role || !user.userType || !menu) return [];

//   switch (user.role) {
//     case 'admin':
//       return menu.items;
//     case 'licensee':
//       return menu.licensee;
//     case 'candidate':
//       return menu.candidate;
//     default:
//       return [];
//   }
// };



export const SideMenu = (user, menuItems) => {
  if (!user || !user.role || !menuItems) return [];

  switch (user.role) {
    case 'admin':
      return menuItems.items;
    case 'licensee':
      return menuItems.licensee;
    default:
      return [];
  }
};
