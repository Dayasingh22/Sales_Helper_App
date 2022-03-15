import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Form, Input, Button, Spin, Row, Col } from 'antd';
import { AuthWrapper, Aside, Content } from '../authentication/overview/style';
import Heading from '../../../components/heading/heading';
import Auth from '@aws-amplify/auth';
import { Main } from '../../styled';
import { PageHeader } from '../../../components/page-headers/page-headers';

const ChangePassword = () => {
  const history = useHistory();

  const [fpState, setFpState] = useState(false);
  const [fpInfo, setFpInfo] = useState();

  const [fpSendError, setFpSendError] = useState(false);
  const [fpResetError, setFpResetError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [user, setUser] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const [username, setUsername] = useState('');

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

  console.log(user);

  const handleSubmit = async values => {
    setLoading(true);
    // const { username } = form.getFieldValue();
    // setUsername(username);
    try {
      const { CodeDeliveryDetails } = await Auth.forgotPassword(user.email);
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
      await Auth.forgotPasswordSubmit(user.email, code, password);
      setSuccess(true);
      setTimeout(() => {
        location.reload();
      }, 3000);
      //location.reload();
      //history.push('/');
    } catch (e) {
      if (e && e.message) {
        setError(true);
        setLoading2(false);
        setFpResetError(e.message);
      }
    }
  };

  const [form] = Form.useForm();
  const [cForm] = Form.useForm();

  const handleChange2 = e => {
    setError(false);
  };

  return (
    <>
      <PageHeader ghost title="Change Password" />

      <Main>
        {/* <Row gutter={25}>
          <Col xxl={18} lg={16} md={14} xs={24}>
            
          </Col>
        </Row> */}
        <Row>
          <Col xxl={16} xl={15} lg={12} md={16} xs={24}>
            <>
              <div className="auth-contents">
                {!fpState && (
                  <Form name="forgotPass" form={form} onSubmitCapture={handleSubmit} layout="vertical">
                    <p className="forgot-text">Click on the below button to get the code and change the password.</p>
                    {/* <Form.Item
                      label="Username"
                      name="username"
                      rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                      <Input placeholder="Your username" onChange={handleChange} />
                    </Form.Item> */}

                    {fpSendError && <div style={{ color: 'red', marginBottom: '15px' }}>{fpSendError?.message}</div>}

                    <Form.Item>
                      <Button className="btn-reset" htmlType="submit" type="primary" size="large" disabled={loading}>
                        {loading ? <Spin size="medium" /> : 'Send Change Instructions'}
                      </Button>
                    </Form.Item>
                  </Form>
                )}

                {fpState && (
                  <Form name="forgotPass" form={cForm} onSubmitCapture={handleCodeSubmit} layout="vertical">
                    <Heading as="h3">Change Password?</Heading>
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

                    {error ? <div style={{ color: 'red', marginBottom: '15px' }}>{fpResetError}</div> : ''}

                    <Form.Item>
                      <Button className="btn-reset" htmlType="submit" type="primary" size="large" disabled={loading2}>
                        {loading2 ? <Spin size="medium" /> : 'Reset password'}
                      </Button>
                    </Form.Item>
                    {success ? <p className="return-text">Successfully changed the Password.</p> : ''}
                  </Form>
                )}
              </div>
            </>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default ChangePassword;
