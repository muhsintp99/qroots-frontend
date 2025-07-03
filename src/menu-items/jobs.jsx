// assent
import { Work, Public, Badge, ConfirmationNumber, CheckBoxOutlineBlank } from '@mui/icons-material';

// icons
const icons = {
    Work,
    Public,
    Badge,
    ConfirmationNumber,
    CheckBoxOutlineBlank
};

// ==============================|| MENU ITEMS - colleges ||============================== //

const jobs = {
    id: 'Jobs',
    title: 'Jobs',
    type: 'group',
    children: [

        {
            id: 'packages',
            title: 'Packages',
            type: 'item',
            url: '/packages',
            icon: icons.CheckBoxOutlineBlank
        },
        {
            id: 'coupens',
            title: 'Coupens',
            type: 'item',
            url: '/coupens',
            icon: icons.ConfirmationNumber
        },
        {
            id: 'jobs',
            title: 'Jobs',
            type: 'item',
            url: '/jobs',
            icon: icons.Work
        },
        {
            id: 'certificates',
            title: 'Certificates',
            type: 'item',
            url: '/certificates',
            icon: icons.Badge
        },
        {
            id: 'country',
            title: 'Country',
            type: 'item',
            url: '/country',
            icon: icons.Public
        },

    ]
};

export default jobs;
