import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Form, Input, Button, Spin, Row, Col } from 'antd';
import { AuthWrapper, Aside, Content } from './style';
import Heading from '../../../../components/heading/heading';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Auth from '@aws-amplify/auth';
import { setItem, removeItem, getItem } from '../../../../utility/localStorageControl';
import actions from '../../../../redux/authentication/actions';

const ValidateOtp = () => {
  const { signupBegin, signupError, signupSuccess, validateOtp, autoLogin: autoLoginAction, tempAuthInfo } = actions;
  const history = useHistory();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flag, setFlag] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [error2, setError2] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [credential, setCredential] = useState(null);

  const otp = useSelector(state => state.auth.otp);

  useEffect(() => {
    if (otp) {
      history.push('/validateOtp');
    }
  }, [otp]);

  useEffect(() => {
    setCredential(getItem('user'));
  }, []);

  const onFinish = values => {
    //console.log(form.getFieldsValue());
    setLoading(true);
    dispatch(signup(form.getFieldsValue()));
  };

  const signup = ({ email }) => {
    const { name, mobile, password } = credential;
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
          setChangeEmail(false);
          setLoading(false);
        } else if (userConfirmed && user) {
          dispatch(signupSuccess(user));
        } else {
          dispatch(signupError({ message: 'Something went wrong' }));
        }
      } catch (err) {
        if (err.code === 'UsernameExistsException') {
          setLoading(false);
          setFlag(true);
          setError('An account with the given email already exists. Please sign in');
          console.log(err);
          dispatch(signupError(err));
        }
      }
    };
  };

  const { user, to, username, password } = useSelector(state => {
    return {
      user: state.auth.user,
      to: state.auth.to,
      username: state.auth.username,
      password: state.auth.password,
    };
  });

  const handleSubmit = values => {
    const { otp } = form.getFieldsValue();
    (async () => {
      try {
        setLoading(true);
        setFlag(false);
        const result = await Auth.confirmSignUp(user.username, otp);
        if (result) {
          if (username) {
            const user1 = await Auth.signIn(username, password);
            console.log(user1);
          }
          const {
            accessToken: { jwtToken },
          } = await Auth.currentSession();
          setItem('access_token', jwtToken);
          removeItem('user');
          //history.push('/admin');
          // setTimeout(() => {
          //   location.reload();
          // }, 20);
          history.push('/validate-mobile');
          return;
        }
      } catch (e) {
        setLoading(false);
        setFlag(true);
        if (e.code === 'CodeMismatchException') {
          setError('Please enter correct otp');
        }
        if (e.code === 'NotAuthorizedException') {
          setError2(true);
          setError('You have entered wrong password, please signin with correct password');
        }
        console.log(e);
        setError(e.message);
        console.error(e.message);
      }
    })();
  };

  const handleChange = e => {
    setFlag(false);
    setSuccessMessage(false);
  };

  const resendOtp = async () => {
    const user1 = await Auth.resendSignUp(username);
    let user = { ...user1, username: username };
    const codeDeliveryDetails = user1.CodeDeliveryDetails;
    if (user1.CodeDeliveryDetails) {
      dispatch(validateOtp({ user, otp: user1.CodeDeliveryDetails }));
    }
    setSuccessMessage(true);
  };

  return (
    <>
      {changeEmail ? (
        <AuthWrapper>
          <p className="auth-notice">
            Already have an account? <NavLink to="/">Sign In</NavLink>
          </p>
          <div className="auth-contents">
            <Form name="register" form={form} onFinish={onFinish} layout="vertical">
              <Heading as="h3">
                Change <span className="color-secondary">Email</span>
              </Heading>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[{ required: true, message: 'Please input your correct email!', type: 'email' }]}
              >
                <Input placeholder="name@example.com" required onChange={handleChange} />
              </Form.Item>
              <Form.Item>
                <Button className="btn-create" htmlType="submit" type="primary" size="large" disabled={loading}>
                  {loading ? <Spin size="medium" /> : 'Change Email'}
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
      ) : (
        <AuthWrapper>
          {error2 === true ? (
            <p className="auth-notice">
              Entered Wrong Password{' '}
              <a
                onClick={() => {
                  location.reload();
                  setTimeout(() => {
                    history.push('/');
                  }, 1000);
                }}
              >
                Sign In Again
              </a>
            </p>
          ) : (
            <p className="auth-notice">
              Entered Wrong Email!&nbsp;&nbsp;
              <a
                onClick={() => {
                  setChangeEmail(true);
                }}
              >
                Change Email
              </a>
            </p>
          )}
          <div className="auth-contents">
            <Form name="forgotPass" form={form} onSubmitCapture={handleSubmit} layout="vertical">
              <Heading as="h3">Validate Email</Heading>
              <p className="forgot-text">
                Enter the OTP sent to the <span className="color-secondary">{user.username}</span> you provided.
              </p>
              <Form.Item
                label="OTP"
                name="otp"
                rules={[{ required: true, message: 'Please input OTP sent to your email!' }]}
              >
                <Input placeholder="123456" onChange={handleChange} type="number" />
              </Form.Item>
              <Form.Item>
                <Button className="btn-reset" htmlType="submit" type="primary" size="large" disabled={loading}>
                  {loading ? <Spin size="medium" /> : 'Confirm Otp'}
                </Button>
              </Form.Item>
              <p className="return-text">
                Didn't recieve the OTP?
                <span className="color-secondary" onClick={resendOtp} style={{ cursor: 'pointer', marginLeft: '10px' }}>
                  Resend Code
                </span>
              </p>
            </Form>
          </div>
          <div>
            <p className="danger text-center" style={{ color: 'blue' }}>
              {successMessage ? 'Successfully sent otp again, please check your mail!' : ''}
            </p>
            <p className="danger text-center" style={{ color: 'red' }}>
              {flag ? error : ''}
            </p>
          </div>
        </AuthWrapper>
      )}
    </>
  );
};

export default ValidateOtp;
