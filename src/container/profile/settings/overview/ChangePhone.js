import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, Spin } from 'antd';
import { ChangePasswordWrapper } from './style';
import { Cards } from '../../../../components/cards/frame/cards-frame';
import { BasicFormWrapper } from '../../../styled';
import Heading from '../../../../components/heading/heading';
import { useHistory, NavLink, Link } from 'react-router-dom';
import Auth from '@aws-amplify/auth';

const ChangePhone = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flag, setFlag] = useState(false);

  const handleSubmit = values => {
    const { phone } = form.getFieldsValue();
    const phoneNumber = `+91${phone}`;
    (async () => {
      try {
        setLoading(true);
        setFlag(false);
        const user = await Auth.currentAuthenticatedUser();
        const changePhoneNumber = await Auth.updateUserAttributes(user, { phone_number: phoneNumber }).then(x => {
          console.log(user);
          history.push('/admin/settings/validatePhone');
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

  const handleChange = e => {
    setFlag(false);
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
              <Form name="forgotPass" form={form} onFinish={handleSubmit} layout="vertical">
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
                    {loading ? <Spin size="medium" /> : 'Change Number'}
                  </Button>
                </Form.Item>
              </Form>
            </BasicFormWrapper>
            <div>
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

export default ChangePhone;
