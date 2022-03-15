import React, { useState } from 'react';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import { UserCard } from '../../../pages/style';
import Heading from '../../../../components/heading/heading';
import { Cards } from '../../../../components/cards/frame/cards-frame';
import Auth from '@aws-amplify/auth';

const UserCards = ({ user }) => {
  const { name, designation, img } = user;
  const [user2, setUser] = useState('');
  React.useEffect(() => {
    (async () => {
      try {
        const {
          accessToken: { jwtToken },
        } = await Auth.currentSession();
        const au = await Auth.currentAuthenticatedUser();
        setUser(au.attributes);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  return (
    <UserCard>
      <div className="card user-card">
        <Cards headless>
          <figure>
            <img src={require(`../../../../${img}`)} alt="" />
          </figure>
          <figcaption>
            <div className="card__content">
              <Heading className="card__name" as="h6">
                <Link to="#">{user2.name}</Link>
              </Heading>
              <p className="card__designation">{designation}</p>
            </div>
            <div className="card__info">
              <Row gutter={15}>
                <Col xs={8}>
                  <div className="info-single">
                    <Heading className="info-single__title" as="h2">
                      $72,572
                    </Heading>
                    <p>Total Revenue</p>
                  </div>
                </Col>
                <Col xs={8}>
                  <div className="info-single">
                    <Heading className="info-single__title" as="h2">
                      3,257
                    </Heading>
                    <p>Assets</p>
                  </div>
                </Col>
                <Col xs={8}>
                  <div className="info-single">
                    <Heading className="info-single__title" as="h2">
                      74
                    </Heading>
                    <p>Property</p>
                  </div>
                </Col>
              </Row>
            </div>
          </figcaption>
        </Cards>
      </div>
    </UserCard>
  );
};

UserCards.propTypes = {
  user: PropTypes.object,
};

export default UserCards;
