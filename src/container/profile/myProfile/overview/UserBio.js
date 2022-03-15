import React, { useState } from 'react';
import FeatherIcon from 'feather-icons-react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';
import { UserBioBox } from './style';
import { Cards } from '../../../../components/cards/frame/cards-frame';
import Auth from '@aws-amplify/auth';

const UserBio = () => {
  const [user, setUser] = useState('');
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
    <UserBioBox>
      <Cards headless>
        <article className="user-info">
          <h5 className="user-info__title">User Bio</h5>
          {user.locale === undefined ? '' : <p>{user.locale}</p>}
        </article>
        <address className="user-info">
          <h5 className="user-info__title">Contact Info</h5>
          <ul className="user-info__contact">
            <li>
              <FeatherIcon icon="mail" size={16} /> <span>{user.email}</span>
            </li>
            <li>
              <FeatherIcon icon="phone" size={16} /> <span>{user.phone_number}</span>
            </li>
            {user.address === undefined ? (
              ''
            ) : (
              <li>
                <FeatherIcon icon="home" size={16} /> <span>{user.address}</span>
              </li>
            )}
            {user.birthdate === undefined ? (
              ''
            ) : (
              <li>
                <FeatherIcon icon="calendar" size={16} /> <span>{user.birthdate}</span>
              </li>
            )}
            {user.gender === undefined ? (
              ''
            ) : (
              <li>
                <FeatherIcon icon="user" size={16} /> <span>{user.gender}</span>
              </li>
            )}
          </ul>
        </address>
        {/* <div className="user-info">
          <h5 className="user-info__title">Skills</h5>
          <div className="user-info__skills">
            <Button type="light" outlined className="btn-outlined">
              UI/UX
            </Button>
            <Button type="light" outlined className="btn-outlined">
              Branding
            </Button>
            <Button type="light" outlined className="btn-outlined">
              product design
            </Button>
            <Button type="light" outlined className="btn-outlined">
              web design
            </Button>
            <Button type="light" outlined className="btn-outlined">
              Application
            </Button>
          </div>
        </div> */}
        {/* <div className="user-info">
          <h5 className="user-info__title">Social Profiles</h5>
          <div className="card__social">
            <Link className="btn-icon facebook" to="#">
              <FontAwesome name="facebook" />
            </Link>
            <Link className="btn-icon twitter" to="#">
              <FontAwesome name="twitter" />
            </Link>
            <Link className="btn-icon dribble" to="#">
              <FontAwesome name="dribbble" />
            </Link>
            <Link className="btn-icon instagram" to="#">
              <FontAwesome name="instagram" />
            </Link>
          </div>
        </div> */}
      </Cards>
    </UserBioBox>
  );
};

export default UserBio;
