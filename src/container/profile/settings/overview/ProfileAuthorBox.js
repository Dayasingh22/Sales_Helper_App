import React, { useState } from 'react';
import { Upload, Modal } from 'antd';
import FeatherIcon from 'feather-icons-react';
import { Link, NavLink, useRouteMatch } from 'react-router-dom';
import propTypes from 'prop-types';
import { ProfileAuthorBox } from './style';
import Heading from '../../../../components/heading/heading';
import { Cards } from '../../../../components/cards/frame/cards-frame';
import Auth from '@aws-amplify/auth';

const AuthorBox = () => {
  const { path } = useRouteMatch();
  const [user, setUser] = useState('');
  const [image, setImage] = useState('');
  const [flag, setFlag] = useState(false);

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

  const uploadPictute = picture => {
    setFlag(true);
    (async () => {
      try {
        const user1 = await Auth.currentAuthenticatedUser();
        const result = await Auth.updateUserAttributes(user1, {
          picture: picture,
        });
      } catch (e) {
        console.error(e);
      }
    })();
  };

  const onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = e => {
        // const gg = JSON.stringify(e.target.result);
        console.log(e.target.result);
        setImage(e.target.result);
        //uploadPictute(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <ProfileAuthorBox>
      <Cards headless>
        <div className="author-info">
          <figure>
            <img
              src={image === '' ? require('../../../../static/img/1.png') : image}
              width="120"
              height="120"
              alt="ddd"
              style={{ marginBottom: '10px' }}
            />
            <input style={{ width: '150px' }} type="file" onChange={onImageChange} />
          </figure>
          {flag ? (
            <div>
              <p className="danger text-center" style={{ color: 'blue' }}>
                Your Picture Successfully Updated
              </p>
            </div>
          ) : (
            ''
          )}
          <figcaption>
            <div className="info">
              <Heading as="h4">{user.name}</Heading>
              <p>Bangalore Distributor</p>
            </div>
          </figcaption>
        </div>
        <nav className="settings-menmulist">
          <ul>
            <li>
              <NavLink to={`${path}/profile`}>
                <FeatherIcon icon="user" size={14} />
                Personal Settings
              </NavLink>
            </li>
            {/* <li>
              <NavLink to={`${path}/kyc`}>
                <FeatherIcon icon="dollar-sign" size={14} />
                Bank Account Settings
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink to={`${path}/pan`}>
                <FeatherIcon icon="credit-card" size={14} />
                Pan Card Settings
              </NavLink>
            </li> */}
            <li>
              <NavLink to={`${path}/change-phone`}>
                <FeatherIcon icon="phone" size={14} />
                Change Phone Number
              </NavLink>
            </li>
            {/* <li>
              <NavLink to={`${path}/notification`}>
                <FeatherIcon icon="bell" size={14} />
                Notification Settings
              </NavLink>
            </li> */}
          </ul>
        </nav>
      </Cards>
    </ProfileAuthorBox>
  );
};

AuthorBox.propTypes = {
  match: propTypes.object,
};

export default AuthorBox;
