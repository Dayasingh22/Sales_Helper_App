import React, { useEffect } from 'react';
import { Row, Col, Alert } from 'antd';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Main } from '../styled';

import SampleCardSix from '../../components/cards/sampleCard/SampleCardSix';
import { useHistory } from 'react-router-dom';

const UserDashboard = () => {
  // useEffect(() => {
  //   console.log(authHeader());
  // }, []);

  const cardSix = [
    {
      id: 1,
      title: 'Distributors List',
      content: 'View All Distributors',
      img: 'static/img/icon/1.svg',
      className: 'primary',
      link: '/admin/list',
    },
    {
      id: 2,
      title: 'Add Distributors',
      content: 'Add Distributors to the list',
      img: 'static/img/icon/2.svg',
      className: 'secondary',
      link: '/admin/add',
    },
    {
      id: 3,
      title: 'Missed Interaction',
      content: 'Check if you have any missed interactions',
      img: 'static/img/icon/3.svg',
      className: 'success',
      link: '/admin/missed',
    },
  ];

  window.addEventListener(
    'popstate',
    function(event) {
      this.location.reload();
    },
    false,
  );

  return (
    <>
      <PageHeader title="Welcome to Sales Application" />
      <Main>
        <Row gutter={25}>
          {cardSix.map(item => {
            return (
              <Col key={item.id} xxl={6} md={12} sm={12} xs={24}>
                <SampleCardSix item={item} />
              </Col>
            );
          })}
        </Row>
      </Main>
    </>
  );
};

export default UserDashboard;
