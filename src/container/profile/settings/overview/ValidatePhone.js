import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, Spin } from 'antd';
import { ChangePasswordWrapper } from './style';
import { Cards } from '../../../../components/cards/frame/cards-frame';
import { BasicFormWrapper } from '../../../styled';
import Heading from '../../../../components/heading/heading';
import { useHistory, NavLink, Link } from 'react-router-dom';
import Auth from '@aws-amplify/auth';

const ValidatePhone = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flag, setFlag] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

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

  const handleSubmit = values => {
    const { otp } = form.getFieldsValue();
    (async () => {
      try {
        setLoading(true);
        setFlag(false);
        const user = await Auth.currentAuthenticatedUser();
        const verifyMobile = await Auth.verifyCurrentUserAttributeSubmit('phone_number', otp).then(x => {
          console.log(user);
          history.push('/admin');
        });
      } catch (e) {
        setLoading(false);
        setFlag(true);
        setError('Please enter correct otp');
        console.error(e);
      }
    })();
  };

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

  const handleChange = e => {
    setFlag(false);
    setSuccessMessage(false);
  };

  const resendOtp = () => {
    sendOtp();
    setSuccessMessage(true);
  };

  return (
    <ChangePasswordWrapper>
      <Cards
        title={
          <div className="setting-card-title">
            <Heading as="h4">Change Phone Number</Heading>
            <span>Change Your Phone Number and Verfiy It!</span>
          </div>
        }
      >
        <Row justify="center">
          <Col lg={12} sm={20} xs={24}>
            <BasicFormWrapper>
              <Form name="forgotPass" form={form} onSubmitCapture={handleSubmit} layout="vertical">
                <Heading as="h3">Validate Mobile</Heading>
                <p className="forgot-text">
                  Enter the One Time Password (OTP) sent to your mobile{' '}
                  <span className="color-secondary">{phoneNumber}</span>
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
                  <span
                    className="color-secondary"
                    onClick={resendOtp}
                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                  >
                    Resend Code
                  </span>
                </p>
              </Form>
            </BasicFormWrapper>
            <div>
              <p className="danger text-center" style={{ color: 'blue' }}>
                {successMessage ? 'Successfully sent otp again, please check your phone!' : ''}
              </p>
              <p className="danger text-center" style={{ color: 'red' }}>
                {flag ? error : ''}
              </p>
            </div>
          </Col>
        </Row>
      </Cards>
    </ChangePasswordWrapper>
  );
};

export default ValidatePhone;
