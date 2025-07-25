// project import
import dashboard from './dashboard';
import utilities from './utilities';
import support from './support';
import enquiries from './enquries';
// import college from './colleges';
import jobs from './jobs';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, jobs, enquiries, utilities, support],
  licensee: [dashboard, jobs, enquiries, utilities]
};

export default menuItems;