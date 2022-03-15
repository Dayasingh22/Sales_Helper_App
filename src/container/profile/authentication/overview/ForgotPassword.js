import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Form, Input, Button, Spin, Row, Col } from 'antd';
import { AuthWrapper, Aside, Content } from './style';
import Heading from '../../../../components/heading/heading';
import Auth from '@aws-amplify/auth';

const ForgotPassword = () => {
  const history = useHistory();

  const [fpState, setFpState] = useState(false);
  const [fpInfo, setFpInfo] = useState();

  const [fpSendError, setFpSendError] = useState(false);
  const [fpResetError, setFpResetError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [username, setUsername] = useState('');

  const handleSubmit = async values => {
    setLoading(true);
    const { username } = form.getFieldValue();
    setUsername(username);
    try {
      const { CodeDeliveryDetails } = await Auth.forgotPassword(username);
      setFpInfo(CodeDeliveryDetails);
      setFpState(true);
    } catch (e) {
      if (e && e.message) {
        setLoading(false);
        setFpSendError(e);
      }
    }
  };

  const handleCodeSubmit = async values => {
    setLoading2(true);
    const { code, password } = cForm.getFieldsValue();
    try {
      await Auth.forgotPasswordSubmit(username, code, password);
      history.push('/');
    } catch (e) {
      if (e && e.message) {
        setLoading2(false);
        setFpResetError(e.message);
      }
    }
  };

  const [form] = Form.useForm();
  const [cForm] = Form.useForm();

  const handleChange = e => {
    setFpSendError('');
  };

  const handleChange2 = e => {
    setFpResetError('');
  };

  return (
    <AuthWrapper>
      <div className="auth-contents">
        {!fpState && (
          <Form name="forgotPass" form={form} onSubmitCapture={handleSubmit} layout="vertical">
            <Heading as="h3">Forgot Password?</Heading>
            <p className="forgot-text">
              Enter the email address you used when you joined and we’ll send you instructions to reset your password.
            </p>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input placeholder="Your username" onChange={handleChange} />
            </Form.Item>

            {fpSendError && <div style={{ color: 'red', marginBottom: '15px' }}>{fpSendError?.message}</div>}

            <Form.Item>
              <Button className="btn-reset" htmlType="submit" type="primary" size="large" disabled={loading}>
                {loading ? <Spin size="medium" /> : 'Send Reset Instructions'}
              </Button>
            </Form.Item>
            <p className="return-text">
              Return to <NavLink to="/">Sign In</NavLink>
            </p>
          </Form>
        )}

        {fpState && (
          <Form name="forgotPass" form={cForm} onSubmitCapture={handleCodeSubmit} layout="vertical">
            <Heading as="h3">Forgot Password?</Heading>
            <p className="forgot-text">
              Enter the code sent to <strong>{fpInfo.Destination}</strong>
            </p>
            <Form.Item label="Code" name="code" rules={[{ required: true, message: 'Please input the code!' }]}>
              <Input placeholder="Your code here" onChange={handleChange2} />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="password"
              rules={[{ required: true, message: 'Please input new password!' }]}
            >
              <Input.Password placeholder="New password" onChange={handleChange2} />
            </Form.Item>

            {fpResetError && <div style={{ color: 'red', marginBottom: '15px' }}>{fpResetError?.message}</div>}

            <Form.Item>
              <Button className="btn-reset" htmlType="submit" type="primary" size="large" disabled={loading2}>
                {loading2 ? <Spin size="medium" /> : 'Reset password'}
              </Button>
            </Form.Item>
            {/* <p className="return-text">
              Return to <NavLink to="/">Sign In</NavLink>
            </p> */}
          </Form>
        )}
      </div>
    </AuthWrapper>
  );
};

export default ForgotPassword;
