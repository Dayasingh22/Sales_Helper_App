import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import { Form, Input, Button, Spin, Checkbox, Row, Col } from 'antd';
import { AuthWrapper, Aside, Content } from './style';
// import { Checkbox } from '../../../../components/checkbox/checkbox';
import Heading from '../../../../components/heading/heading';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import actions from '../../../../redux/authentication/actions';
import Auth from '@aws-amplify/auth';
import { setItem, getItem } from '../../../../utility/localStorageControl';

const SignUp = () => {
  const { signupBegin, signupError, signupSuccess, validateOtp, autoLogin: autoLoginAction, tempAuthInfo } = actions;
  const [error, setError] = useState('');
  const [flag, setFlag] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [savedValues, setInitiaValues] = useState({});

  const [form] = Form.useForm();

  const onCheckboxChange = e => {
    setFlag(false);
    setChecked(e.target.checked);
  };

  const otp = useSelector(state => state.auth.otp);

  useEffect(() => {
    const user = getItem('user');
    setInitiaValues(user);
  }, []);

  useEffect(() => {
    if (otp) {
      history.push('/validateOtp');
    }
  }, [otp]);

  const onFinish = values => {
    setItem('user', JSON.stringify(values));
    if (checked === true) {
      setLoading(true);
      dispatch(signup(form.getFieldsValue()));
    } else {
      setFlag(true);
      setError('Please accept the terms and conditions');
    }
  };

  const signup = ({ password, email, name, mobile }) => {
    return async dispatch => {
      try {
        dispatch(signupBegin());
        let userAttributes = { name };
        let usernameVal = '';
        const steps = [{ step4: 'null' }, { step6: 'null' }, { step7: 'null' }, { qualified: 'false' }];
        const stringStep = JSON.stringify(steps);
        if (mobile) {
          userAttributes['phone_number'] = `+91${mobile}`;
          userAttributes['custom:settings'] = stringStep;
          // userAttributes['custom:roles'] = 'null';
          // userAttributes['custom:permissions'] = 'null';
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

  const handleChange = e => {
    setFlag(false);
  };
  return (
    <AuthWrapper>
      <p className="auth-notice">
        Already have an account? <NavLink to="/">Sign In</NavLink>
      </p>{' '}
      <div className="auth-contents">
        <Form name="register" form={form} onFinish={onFinish} layout="vertical">
          <Heading as="h3">
            Sign Up for <span className="color-secondary">FRXNL</span>
          </Heading>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your Full name!' }]}>
            <Input placeholder="Full name" required onChange={handleChange} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email Address"
            rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
          >
            <Input placeholder="name@example.com" required onChange={handleChange} />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                validator(_, value) {
                  // var re = new RegExp('(?=.*[A-Z])');&& re.test(value)
                  if (!value || value.length >= 6) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Please enter atleast 6 character password!');
                },
              },
            ]}
          >
            <Input.Password placeholder="Password" required onChange={handleChange} />
          </Form.Item>
          <Form.Item
            label="Mobile"
            name="mobile"
            rules={[
              {
                required: true,
                message: 'Please input your Mobile Number!',
              },
              {
                validator(_, value) {
                  if (!value || value.length === 10) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Please enter 10 digit Number!');
                },
              },
            ]}
          >
            <Input placeholder="Phone number without country code" required onChange={handleChange} type="number" />
          </Form.Item>
          <Form.Item>
            <div className="auth-form-action">
              <Checkbox checked={checked} onChange={onCheckboxChange}>
                Creating an account means you’re okay with our Terms of Service and Privacy Policy
              </Checkbox>
            </div>
          </Form.Item>

          <Form.Item>
            <Button className="btn-create" htmlType="submit" type="primary" size="large" disabled={loading}>
              {loading ? <Spin size="medium" /> : 'Create Account'}
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

export default SignUp;
