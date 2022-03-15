import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Spin, Row, Col } from 'antd';
import { AuthWrapper, Aside, Content } from './style';
import Heading from '../../../../components/heading/heading';
import { useDispatch, useSelector } from 'react-redux';
import Auth from '@aws-amplify/auth';
import { useHistory } from 'react-router-dom';
import actions from '../../../../redux/authentication/actions';
import { setItem } from '../../../../utility/localStorageControl';

const ChangeNumber = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flag, setFlag] = useState(false);
  const { autoLogin: autoLoginAction, setUserAuthToken } = actions;

  const [state, setState] = useState({
    values: null,
  });

  const { username, password } = useSelector(state => {
    return {
      username: state.auth.username,
      password: state.auth.password,
    };
  });

  const onFinish = values => {
    const { phone } = form.getFieldsValue();
    const phoneNumber = `+91${phone}`;
    (async () => {
      try {
        setLoading(true);
        setFlag(false);
        const user = await Auth.currentAuthenticatedUser();
        const changePhoneNumber = await Auth.updateUserAttributes(user, { phone_number: phoneNumber }).then(x => {
          console.log(user);
          history.entries = [];
          history.index = -1;
          history.push('/validate-mobile');
          // dispatch(autoLogin(user));
        });
        console.log(changePhoneNumber);
      } catch (e) {
        setLoading(false);
        setFlag(true);
        setError('Please enter correct phone');
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
  };

  return (
    <AuthWrapper>
      <div className="auth-contents">
        <Form name="forgotPass" form={form} onFinish={onFinish} layout="vertical">
          <Heading as="h3">Change Phone Number</Heading>
          <p className="forgot-text">Enter the Phone Number you want to change.</p>
          <Form.Item
            label="Phone"
            name="phone"
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
            <Input placeholder="8957845145" onChange={handleChange} type="number" />
          </Form.Item>
          <Form.Item>
            <Button className="btn-reset" htmlType="submit" type="primary" size="large" disabled={loading}>
              {loading ? <Spin size="medium" /> : 'Change Phone Number'}
            </Button>
          </Form.Item>
          {/* <p className="return-text">
            Return to <NavLink to="/">Sign In</NavLink>
          </p> */}
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

export default ChangeNumber;
