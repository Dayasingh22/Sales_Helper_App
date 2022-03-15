import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { Link, NavLink, useHistory } from 'react-router-dom';
import { Form, Input, Button, notification, Spin, Checkbox, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies

import { AuthWrapper, Aside, Content } from './style';
// import { Checkbox } from '../../../../components/checkbox/checkbox';
import Heading from '../../../../components/heading/heading';

import actions from '../../../../redux/authentication/actions';
import Auth from '@aws-amplify/auth';
import { setItem, removeItem } from '../../../../utility/localStorageControl';
import axios from 'axios';

const { clearAuthMessage } = actions;

const SignIn = () => {
  const { loginBegin, loginErr, autoLogin: autoLoginAction, setUserAuthToken, validateOtp, tempAuthInfo } = actions;
  const history = useHistory();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const otp = useSelector(state => state.auth.otp);

  const [form] = Form.useForm();
  const [state, setState] = useState({
    checked: null,
  });

  const { msg, isLoading, user } = useSelector(state => {
    return {
      loading: state.auth.loading,
      msg: state.auth.msg,
      user: state.auth.user,
    };
  });

  const handleSubmit = () => {
    setLoading(true);
    dispatch(login(form.getFieldValue()));
  };

  const onChange = checked => {
    setState({ ...state, checked });
  };

  useEffect(() => {
    if (msg) {
      notification.open({
        message: 'Important',
        description: msg,
      });
      dispatch(clearAuthMessage());
    }
  }, [msg]);

  useEffect(() => {
    if (user) {
      history.push('/citizenship');
    }
  }, [user]);

  useEffect(() => {
    if (otp) {
      history.push('/validateOtp');
    }
  }, [otp]);

  const login = ({ username, password }) => {
    return async dispatch => {
      try {
        dispatch(loginBegin());
        removeItem('user');
        const user1 = await Auth.signIn({ username, password });
        const user = await Auth.currentAuthenticatedUser();
        const api = process.env.REACT_APP_BACKEND_API;
        const URL = `${api}distributors/token`;
        var config = {
          method: 'post',
          url: URL,
        };
        axios(config)
          .then(function(response) {
            setItem('jwt', response.data);
          })
          .catch(function(error) {
            console.log(error);
          });
        if (!user.attributes.phone_number_verified) {
          history.push('/validate-mobile');
          return;
        }
        if (user.attributes.phone_number_verified) {
          dispatch(autoLogin(user));
          return;
        }
      } catch (err) {
        if (err.code === 'UserNotConfirmedException') {
          const user1 = await Auth.resendSignUp(username);
          dispatch(tempAuthInfo(username, password));
          let user = { ...user1, username: username };
          const codeDeliveryDetails = user1.CodeDeliveryDetails;
          if (user1.CodeDeliveryDetails) {
            dispatch(validateOtp({ user, otp: user1.CodeDeliveryDetails }));
          }
        }
        setLoading(false);
        setFlag(true);
        setError(err.message);
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

  const handleChange = e => {
    setFlag(false);
  };

  return (
    <AuthWrapper>
      <p className="auth-notice" style={{ visibility: 'hidden' }}>
        Don&rsquo;t have an account? <NavLink to="/register">Sign up now</NavLink>
      </p>
      <div className="auth-contents">
        <Form name="login" form={form} onSubmitCapture={handleSubmit} layout="vertical">
          <Heading as="h3">Sign in</Heading>
          <Form.Item
            name="username"
            rules={[{ message: 'Please input your Email!', required: true }]}
            label="Email Address"
          >
            <Input placeholder="Email" required onChange={handleChange} />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input.Password placeholder="Password" required onChange={handleChange} />
          </Form.Item>
          <div className="auth-form-action">
            <Checkbox onChange={onChange}>Keep me logged in</Checkbox>
            <NavLink className="forgot-pass-link" to="/forgotPassword">
              Forgot password?
            </NavLink>
          </div>
          <Form.Item>
            <Button className="btn-signin" htmlType="submit" type="primary" size="large" disabled={loading}>
              {loading ? <Spin size="medium" /> : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div>
        <p className="danger text-center" style={{ color: 'red' }}>
          {flag ? error : ''}
        </p>
      </div>
    </AuthWrapper>
  );
};

export default SignIn;
