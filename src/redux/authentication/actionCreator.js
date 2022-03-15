import Cookies from 'js-cookie';
import actions from './actions';

import Auth from '@aws-amplify/auth';

import { setItem, removeItem } from '../../utility/localStorageControl';

const {
  loginBegin,
  loginSuccess,
  loginErr,
  logoutBegin,
  logoutSuccess,
  logoutErr,

  signupBegin,
  signupError,
  signupSuccess,

  validateOtp,
  validateOtpBegin,
  validateOtpSuccess,
  validateOtpError,

  autoLogin: autoLoginAction,
  setUserAuthToken,
  resetUserAuthToken,

  tempAuthInfo,
} = actions;

const login = ({ username, password }) => {
  return async dispatch => {
    try {
      dispatch(loginBegin());
      await Auth.signIn({ username, password });
      console.log('signIn Methode', user);
      const user = await Auth.currentAuthenticatedUser();
      console.log(user);
      return dispatch(autoLogin(user));
    } catch (err) {
      console.error(err);
      dispatch(loginErr(err));
    }
  };
};

const signup = ({ password, email, name, mobile }) => {
  return async dispatch => {
    try {
      dispatch(signupBegin());
      let userAttributes = { name };
      let usernameVal = '';
      if (mobile) {
        userAttributes['phone_number'] = `+91${mobile}`;
      }
      if (email) {
        userAttributes['email'] = email;
        usernameVal = email;
      }

      const { userConfirmed, user, codeDeliveryDetails } = await Auth.signUp({
        username: usernameVal,
        password,
        attributes: userAttributes,
      });

      dispatch(tempAuthInfo(usernameVal, password));

      if (!userConfirmed && codeDeliveryDetails) {
        dispatch(validateOtp({ user, otp: codeDeliveryDetails }));
      } else if (userConfirmed && user) {
        dispatch(signupSuccess(user));
      } else {
        dispatch(signupError({ message: 'Something went wrong' }));
      }
    } catch (err) {
      console.error(err.message);
      dispatch(signupError(err));
    }
  };
};

const validate = ({ username, otp }) => {
  return async dispatch => {
    try {
      dispatch(validateOtpBegin());
      const result = await Auth.confirmSignUp(username, otp);
      return dispatch(validateOtpSuccess());
    } catch (err) {
      console.error(err);
      dispatch(validateOtpError(err));
    }
  };
};

const logOut = location => {
  return async dispatch => {
    try {
      dispatch(logoutBegin());
      await Auth.signOut();
      removeItem('access_token');
      dispatch(resetUserAuthToken());
      dispatch(logoutSuccess(null));
      setTimeout(() => {
        location.reload();
      }, 20);
    } catch (err) {
      dispatch(logoutErr(err));
    }
  };
};

const autoLogin = user => {
  return async dispatch => {
    dispatch(autoLoginAction(user));
    const {
      accessToken: { jwtToken },
    } = await Auth.currentSession();
    setItem('access_token', jwtToken);
    return dispatch(setUserAuthToken(jwtToken));
  };
};

export { login, logOut, signup, validate, autoLogin };
