import React, { lazy, Suspense } from 'react';
import { Row, Col, Skeleton } from 'antd';
import FeatherIcon from 'feather-icons-react';
import { useRouteMatch } from 'react-router-dom';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';

const UserCards = lazy(() => import('./overview/UserCard'));
const UserBio = lazy(() => import('./overview/UserBio'));

const MyProfile = () => {
  const { path } = useRouteMatch();
  return (
    <>
      <PageHeader ghost title="My Profile" />

      <Main>
        <Row gutter={25}>
          <Col xxl={24} lg={22} md={14} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton avatar active paragraph={{ rows: 3 }} />
                </Cards>
              }
            >
              <UserCards
                user={{ name: 'Duran Clyton', designation: 'Bangalore Distributor', img: 'static/img/1.png' }}
              />
            </Suspense>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active paragraph={{ rows: 10 }} />
                </Cards>
              }
            >
              <UserBio />
            </Suspense>
          </Col>
        </Row>
      </Main>
    </>
  );
};

MyProfile.propTypes = {
  // match: propTypes.object,
};

export default MyProfile;
