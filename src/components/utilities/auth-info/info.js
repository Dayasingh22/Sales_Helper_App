import React, { useState, useEffect } from 'react';
import { Avatar } from 'antd';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FeatherIcon from 'feather-icons-react';
import { InfoWraper, UserDropDwon } from './auth-info-style';
import { Popover } from '../../popup/popup';
import { logOut } from '../../../redux/authentication/actionCreator';
import Heading from '../../heading/heading';
import { Auth } from '@aws-amplify/auth';

const AuthInfo = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState([]);
  const { path } = useRouteMatch();

  useEffect(() => {
    (async () => {
      try {
        const au = await Auth.currentAuthenticatedUser();
        setCurrentUser(au.attributes);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [Auth]);

  const [state, setState] = useState({
    flag: 'english',
  });
  const { flag } = state;

  const { logoutDone } = useSelector(state => {
    return {
      logoutDone: state.auth.logoutDone,
    };
  });

  React.useEffect(() => {
    if (logoutDone === true) {
      setTimeout(() => {
        history.push('/signin');
      }, 100);
    }
  }, [logoutDone]);

  const SignOut = e => {
    e.preventDefault();
    dispatch(logOut(location));
  };

  const userContent = (
    <UserDropDwon>
      <div className="user-dropdwon">
        <figure className="user-dropdwon__info">
          <img
            src="https://cdn0.iconfinder.com/data/icons/user-pictures/100/matureman1-512.png"
            alt="avatar"
            style={{ width: '40px' }}
          />
          <figcaption>
            <Heading as="h5">{currentUser.name}</Heading>
            <p>{currentUser.phone_number}</p>
          </figcaption>
        </figure>
        <ul className="user-dropdwon__links">
          <li>
            <Link to={`${path}/profile`}>
              <FeatherIcon icon="user" /> Profile
            </Link>
          </li>
          <li>
            <Link to={`${path}/settings`}>
              <FeatherIcon icon="settings" /> Settings
            </Link>
          </li>
          <li>
            <Link to={`${path}/change-password`}>
              <FeatherIcon icon="lock" /> Change Password
            </Link>
          </li>
        </ul>
        <Link className="user-dropdwon__bottomAction" onClick={SignOut} to="#">
          <FeatherIcon icon="log-out" /> Sign Out
        </Link>
      </div>
    </UserDropDwon>
  );

  return (
    <InfoWraper>
      <div className="nav-author">
        <Popover placement="bottomRight" content={userContent} action="click">
          <Link to="#" className="head-example">
            <Avatar src="https://cdn0.iconfinder.com/data/icons/user-pictures/100/matureman1-512.png" />
          </Link>
        </Popover>
      </div>
    </InfoWraper>
  );
};

export default AuthInfo;
