import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hot } from 'react-hot-loader/root';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Redirect, Route, useHistory } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Auth } from '@aws-amplify/auth';
import store from './redux/store';
import Admin from './routes/admin';
import AuthLayout from './routes/auth';
import './static/css/style.css';
import config from './config/config';
import ProtectedRoute from './components/utilities/protectedRoute';
import { autoLogin } from './redux/authentication/actionCreator';

const { theme } = config;

const useAuthUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const au = await Auth.currentAuthenticatedUser();
        /* const {attributes} = au;
        if(attributes.email_verified && attributes.phone_number_verified) { */
        setUser({ user: au });
        // console.log(au);
        /* }  else {
          setUser({user: false, go: '/validate-mobile'});
        /*} */
      } catch (e) {
        //console.error(e);
      }
    })();
  }, [Auth]);
  return user;
};

const RoutesPath = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => {
    return {
      isLoggedIn: state.auth.login,
    };
  });

  const currentUser = useAuthUser();
  const history = useHistory();

  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      setPath(window.location.pathname);
    }
    // eslint-disable-next-line no-return-assign
    return () => (unmounted = true);
  }, [setPath]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.user) {
        dispatch(autoLogin(currentUser));
      } else if (currentUser.go) {
        // eslint-disable-next-line no-unused-expressions
        history?.push(currentUser.go);
      }
    }
  }, [currentUser, history]);

  return (
    <>
      {!isLoggedIn ? <Route path="/" component={AuthLayout} /> : <ProtectedRoute path="/admin" component={Admin} />}
      {isLoggedIn && (path === process.env.PUBLIC_URL || path === `${process.env.PUBLIC_URL}/`) && (
        <Redirect to="/admin" />
      )}
    </>
  );
};

const ProviderConfig = () => {
  const { rtl, topMenu, darkMode } = useSelector(state => {
    return {
      // darkMode: state.ChangeLayoutMode.data,
      // rtl: state.ChangeLayoutMode.rtlData,
      // topMenu: state.ChangeLayoutMode.topMenu,
      isLoggedIn: state.auth.login,
    };
  });

  return (
    <ConfigProvider direction={rtl ? 'rtl' : 'ltr'}>
      <ThemeProvider theme={{ ...theme, rtl, topMenu, darkMode }}>
        <Router basename={process.env.PUBLIC_URL}>
          <RoutesPath />
        </Router>
      </ThemeProvider>
    </ConfigProvider>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ProviderConfig />
    </Provider>
  );
}

export default hot(App);
