import { all, call } from 'redux-saga/effects';

import LoginActionWatcher from '../container/LoginContainer/saga';
import CountrySagaWatcher from '../pages/container/country/saga';
import GalleryActionWatcher from '../pages/container/gallery/saga';
import UserActionWatcher from '../pages/auth/users/container/saga';
import BlogActionWatcher from '../pages/container/blog/saga';
import serviceWatcherSaga from '../pages/container/service/saga';
import EnquiryWatcher from '../pages/container/enquries/saga';
import followUpWatcher from '../pages/container/follow-up/saga';
import ContactActionWatcher from '../pages/container/contact/saga';
import CollegeActionWatcher from '../pages/container/colleges/saga';
import CourseActionWatcher from '../pages/container/courses/saga';
import IntakeActionWatcher from '../pages/container/intake/saga';
import JobActionWatcher from '../pages/container/jobs/saga';
import CertificateWatcherSaga from '../pages/container/certificate/saga';
import CouponActionWatcher from '../pages/container/couponCode/saga';
import PackageActionWatcher from '../pages/container/package/saga';
import CandidateActionWatcher from '../pages/container/candidate/saga';

function* rootSaga() {
  yield all([
    call(LoginActionWatcher),
    call(UserActionWatcher),
    call(CandidateActionWatcher),
    call(CountrySagaWatcher),
    call(GalleryActionWatcher),
    call(BlogActionWatcher),
    call(serviceWatcherSaga),
    call(EnquiryWatcher),
    call(followUpWatcher),
    call(ContactActionWatcher),
    call(CollegeActionWatcher),
    call(CourseActionWatcher),
    call(IntakeActionWatcher),
    call(JobActionWatcher),
    call(CertificateWatcherSaga),
    call(CouponActionWatcher),
    call(PackageActionWatcher),
  ]);
}

export default rootSaga;
