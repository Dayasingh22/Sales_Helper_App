import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Spin, Row, Col } from 'antd';
import { AuthWrapper, Aside, Content } from './style';
import Heading from '../../../../components/heading/heading';
import { useDispatch, useSelector } from 'react-redux';
import Auth from '@aws-amplify/auth';
import { useHistory, NavLink, Link } from 'react-router-dom';
import actions from '../../../../redux/authentication/actions';
import { setItem } from '../../../../utility/localStorageControl';

const ValidateMobile = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flag, setFlag] = useState(false);
  const { autoLogin: autoLoginAction, setUserAuthToken } = actions;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [state, setState] = useState({
    values: null,
  });

  const { username, password } = useSelector(state => {
    return {
      username: state.auth.username,
      password: state.auth.password,
    };
  });

  React.useEffect(() => {
    (async () => {
      try {
        const {
          accessToken: { jwtToken },
        } = await Auth.currentSession();
        const details = await Auth.currentAuthenticatedUser().then(x => {
          setPhoneNumber(x.attributes.phone_number);
          if (x.attributes.phone_number_verified !== true) {
            var dd = Auth.verifyCurrentUserAttribute('phone_number').then(x => {
              console.log(x);
            });
          } else {
            console.log('error');
          }
        });
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const sendOtp = () => {
    (async () => {
      try {
        const {
          accessToken: { jwtToken },
        } = await Auth.currentSession();
        const details = await Auth.currentAuthenticatedUser().then(x => {
          setPhoneNumber(x.attributes.phone_number);
          if (x.attributes.phone_number_verified !== true) {
            var dd = Auth.verifyCurrentUserAttribute('phone_number').then(x => {
              console.log(x);
            });
          } else {
            console.log('error');
          }
        });
      } catch (e) {
        console.error(e);
      }
    })();
  };

  const handleSubmit = values => {
    const { otp } = form.getFieldsValue();
    (async () => {
      try {
        setLoading(true);
        setFlag(false);
        const user = await Auth.currentAuthenticatedUser();
        const verifyMobile = await Auth.verifyCurrentUserAttributeSubmit('phone_number', otp).then(x => {
          console.log(user);
        });
        setTimeout(() => {
          history.push('/admin');
          location.reload();
        }, 2000);
        // const currentUserInfo = await Auth.currentUserInfo();
        // const step4 = currentUserInfo.attributes['custom:settings'];
        // const steps = JSON.parse(step4);
        // if (steps[0].step4 === 'null') {
        //   history.entries = [];
        //   history.index = -1;
        //   history.push('/step4');
        //   return;
        // }
        // if (steps[1].step6 === 'null') {
        //   history.push('/step6');
        //   return;
        // }
        // if (steps[2].step7 === 'null') {
        //   history.push('/step7');
        //   return;
        // }
      } catch (e) {
        setLoading(false);
        setFlag(true);
        setError('Please enter correct otp');
        console.error(e);
      }
    })();
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
    setSuccessMessage(false);
  };

  const resendOtp = () => {
    sendOtp();
    setSuccessMessage(true);
  };

  return (
    <AuthWrapper>
      <p className="auth-notice">
        Wrong Phone Number, <NavLink to="/change-number">Change Number</NavLink>
      </p>
      <div className="auth-contents">
        <Form name="forgotPass" form={form} onSubmitCapture={handleSubmit} layout="vertical">
          <Heading as="h3">Validate Mobile</Heading>
          <p className="forgot-text">
            Enter the One Time Password (OTP) sent to your mobile <span className="color-secondary">{phoneNumber}</span>
          </p>
          <Form.Item
            label="OTP"
            name="otp"
            rules={[{ required: true, message: 'Please input OTP sent to your mobile!' }]}
          >
            <Input placeholder="123456" onChange={handleChange} type="number" />
          </Form.Item>
          <Form.Item>
            <Button className="btn-reset" htmlType="submit" type="primary" size="large" disabled={loading}>
              {loading ? <Spin size="medium" /> : 'Confirm OTP'}
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
          {successMessage ? 'Successfully sent otp again, please check your phone!' : ''}
        </p>
        <p className="danger text-center" style={{ color: 'red' }}>
          {flag ? error : ''}
        </p>
      </div>
    </AuthWrapper>
  );
};

export default ValidateMobile;
