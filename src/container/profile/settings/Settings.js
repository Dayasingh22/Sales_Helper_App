import React, { lazy, Suspense } from 'react';
import { Row, Col, Skeleton } from 'antd';
import FeatherIcon from 'feather-icons-react';
import { Switch, Route } from 'react-router-dom';
import propTypes from 'prop-types';
import { SettingWrapper } from './overview/style';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';

const Profile = lazy(() => import('./overview/Profile'));
const AuthorBox = lazy(() => import('./overview/ProfileAuthorBox'));
const ChangePhoneNumber = lazy(() => import('./overview/ChangePhone'));
const ValidatePhone = lazy(() => import('./overview/ValidatePhone'));

const Settings = ({ match }) => {
  const { path } = match;

  return (
    <>
      <PageHeader ghost title="Settings" />

      <Main>
        <Row gutter={25}>
          <Col xxl={6} lg={8} md={10} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton avatar />
                </Cards>
              }
            >
              <AuthorBox />
            </Suspense>
          </Col>
          <Col xxl={18} lg={16} md={14} xs={24}>
            <SettingWrapper>
              <Switch>
                <Suspense
                  fallback={
                    <Cards headless>
                      <Skeleton paragraph={{ rows: 20 }} />
                    </Cards>
                  }
                >
                  <Route exact path={`${path}`} component={Profile} />
                  <Route exact path={`${path}/profile`} component={Profile} />
                  <Route exact path={`${path}/change-phone`} component={ChangePhoneNumber} />
                  <Route exact path={`${path}/validatePhone`} component={ValidatePhone} />
                </Suspense>
              </Switch>
            </SettingWrapper>
          </Col>
        </Row>
      </Main>
    </>
  );
};

Settings.propTypes = {
  match: propTypes.object,
};

export default Settings;
