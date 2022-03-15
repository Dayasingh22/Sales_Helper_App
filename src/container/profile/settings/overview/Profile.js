import React, { useState } from 'react';
import { Row, Col, Form, Input, Select, Spin } from 'antd';
import { Cards } from '../../../../components/cards/frame/cards-frame';
import { Button } from '../../../../components/buttons/buttons';
import { BasicFormWrapper } from '../../../styled';
import Heading from '../../../../components/heading/heading';
import Auth from '@aws-amplify/auth';
import { useHistory } from 'react-router-dom';

const { Option } = Select;
const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flag, setFlag] = useState(false);
  const [user, setUser] = useState('');
  const history = useHistory();

  React.useEffect(() => {
    const kkk = user.phone_number === undefined ? '' : user.phone_number;
    const number = kkk.replace('+91', '');
    form.setFieldsValue({
      name: user.name,
      gender: user.gender,
      address: user.address,
      birthdate: user.birthdate,
      aboutMe: user.locale,
    });
  }, [user]);

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

  const handleSubmit = values => {
    console.log(values);
    const phone = `+91${values.mobile}`;
    (async () => {
      try {
        setLoading(true);
        setFlag(false);
        const user1 = await Auth.currentAuthenticatedUser();
        const result = await Auth.updateUserAttributes(user1, {
          name: values.name,
          birthdate: values.birthdate,
          address: values.address,
          gender: values.gender,
          locale: values.aboutMe,
        });
        history.push('/admin');
      } catch (e) {
        setError(e.message);
        setLoading(false);
        setFlag(true);
        console.error(e);
      }
    })();
  };

  const handleCancel = e => {
    e.preventDefault();
    history.push('/admin');
  };

  const handleChange = e => {
    setFlag(false);
  };

  return (
    <Cards
      title={
        <div className="setting-card-title">
          <Heading as="h4">Edit Profile</Heading>
          <span>Set Up Your Personal Information</span>
        </div>
      }
    >
      <Row justify="center">
        <Col xl={16} lg={20} xs={24}>
          <BasicFormWrapper>
            <Form name="editProfile" form={form} onFinish={handleSubmit}>
              <Form.Item name="name" label="Name">
                <Input />
              </Form.Item>
              <Form.Item name="address" label="Your Full Address">
                <Input.TextArea
                  rows={5}
                  placeholder="Enter Your Full Address with Country and Pin Code"
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item name="birthdate" label="Your Date of Birth">
                <Input placeholder="DOB" type="date" onChange={handleChange} />
              </Form.Item>
              <Form.Item name="gender" initialValue="" label="Gender">
                <Select style={{ width: '100%' }}>
                  <Option value="">Please Select</Option>
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="nogender">Not to say</Option>
                </Select>
              </Form.Item>
              <Form.Item name="aboutMe" label="About Me">
                <Input.TextArea rows={5} placeholder="About Me" />
              </Form.Item>
              <div className="setting-form-actions">
                <Button className="btn-reset" htmlType="submit" type="primary" size="large" disabled={loading}>
                  {loading ? <Spin size="medium" /> : 'Update Profile'}
                </Button>
                &nbsp; &nbsp;
                <Button size="default" onClick={handleCancel} type="light">
                  Cancel
                </Button>
              </div>
            </Form>
            <div>
              <p className="danger text-center" style={{ color: 'red' }}>
                {flag ? error : ''}
              </p>
            </div>
          </BasicFormWrapper>
        </Col>
      </Row>
    </Cards>
  );
};

export default Profile;
