import React, { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import withAdminLayout from '../../layout/withAdminLayout';

const UserDashboard = lazy(() => import('../../container/pages/UserDashboard'));
const Settings = lazy(() => import('../../container/profile/settings/Settings'));
const ChangePassword = lazy(() => import('../../container/profile/settings/ChangePassword'));
const Myprofile = lazy(() => import('../../container/profile/myProfile/Index'));
const DistributorList = lazy(() => import('../../container/pages/Distributor/DistributorList'));
const AddDistributor = lazy(() => import('../../container/pages/Distributor/AddDistributor'));
const EditDistributor = lazy(() => import('../../container/pages/Distributor/EditDistributor'));
const MissedInteraction = lazy(() => import('../../container/pages/Distributor/MissedInteraction'));

const Admin = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Suspense
        fallback={
          <div className="spin">
            <Spin />
          </div>
        }
      >
        <Route path={path} exact component={UserDashboard} />
        <Route path={`${path}/change-password`} component={ChangePassword} />
        <Route path={`${path}/settings`} component={Settings} />
        <Route path={`${path}/profile`} component={Myprofile} />
        <Route path={`${path}/list`} component={DistributorList} />
        <Route path={`${path}/missed`} component={MissedInteraction} />
        <Route path={`${path}/add`} component={AddDistributor} />
        <Route path={`${path}/edituser/:id`} component={EditDistributor} />
      </Suspense>
    </Switch>
  );
};

export default withAdminLayout(Admin);
