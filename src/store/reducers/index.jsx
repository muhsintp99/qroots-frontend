// third-party
import { combineReducers } from 'redux';

// project import
import loginReducer from 'container/LoginContainer/slice';
import usersReducer from '../../pages/auth/users/container/slice';
import countryReducer from '../../pages/container/country/slice';
import galleryReducer from '../../pages/container/gallery/slice'
import blogReducer from '../../pages/container/blog/slice';
import serviceReducer from '../../pages/container/service/slice';
import enquiriesReducer from '../../pages/container/enquries/slice';
import followUpReducer from '../../pages/container/follow-up/slice';
import contactReducer from '../../pages/container/contact/slice';
import collegesReducer from '../../pages/container/colleges/slice';
import coursesReducer from '../../pages/container/courses/slice';
import intakeReducer from '../../pages/container/intake/slice';
import jobsReducer from '../../pages/container/jobs/slice';
import certificateReducer from '../../pages/container/certificate/slice';
import couponsReducer from '../../pages/container/couponCode/slice';
import packagesReducer from '../../pages/container/package/slice';
import menu from './menu';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
    menu,
    login: loginReducer,
    users: usersReducer,
    country: countryReducer,
    gallery: galleryReducer,
    services: serviceReducer,
    blog: blogReducer,
    enquiries: enquiriesReducer,
    followUp: followUpReducer,
    contact: contactReducer,
    college: collegesReducer,
    courses: coursesReducer,
    intakes: intakeReducer,
    jobs: jobsReducer,
    certificates:certificateReducer,
    coupons:couponsReducer,
    packages:packagesReducer
});

export default reducers;
