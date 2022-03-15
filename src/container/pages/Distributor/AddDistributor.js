import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Input, Form, Spin, Alert, Select } from 'antd';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, ExportStyleWrap, TableWrapper } from '../../styled';
import { UserTableStyleWrapper } from '../style';
import FeatherIcon from 'feather-icons-react';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import Heading from '../../../components/heading/heading';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import axios from 'axios';
import { getItem } from '../../../utility/localStorageControl';
import { Auth } from '@aws-amplify/auth';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const AddDistributor = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [loading2, setLoading2] = useState(false);
  const [flag2, setFlag2] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [primaryNumber, setPrimaryNumber] = useState('');
  const [secondaryNumber, setSecondaryNumber] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const au = await Auth.currentAuthenticatedUser();
        setUser({ user: au });
      } catch (e) {
        console.error(e);
      }
    })();
  }, [Auth]);

  const handleSubmit = values => {
    setLoading2(true);
    const jwtToken = getItem('jwt');
    const api = process.env.REACT_APP_BACKEND_API;
    const distributorValues = {
      leadDate: new Date().toISOString().split('T')[0],
      primaryNumber: values.primaryNumber,
      secondaryNumber: values.secondaryNumber,
      name: values.name,
      company: values.companyName,
      email: values.email,
      address: values.address,
      region: values.region,
      status: 'Open',
      comments: '',
      callOpen: {
        callBackDate: '',
        callBackTime: '',
      },
      meetingProposed: {
        callBackDate: '',
        callBackTime: '',
      },
      meetingDone: '',
      revisit1: '',
      revisit2: '',
      registered: '',
      lost: {
        reason: '',
        product: '',
        other: '',
      },
      modifiedBy: {
        name: user.user.attributes.name,
        email: user.user.attributes.email,
      },
      wrongLead: false,
    };
    const URL = `${api}distributors/add-user`;
    var config = {
      method: 'post',
      url: URL,
      headers: {
        'x-access-token': `${jwtToken.token}`,
      },
      data: distributorValues,
    };
    axios(config)
      .then(function(response) {
        setLoading2(false);
        const result = response.data;
        console.log(result);
        history.push({
          pathname: '/admin/list',
          state: { detail: `${values.name} Added Successfully` },
        });
      })
      .catch(function(error) {
        setLoading2(false);
        setFlag2(true);
        setError('This Email already exists in database');
        console.log(error);
      });
  };
  const handleChange = e => {
    setFlag2(false);
  };

  const specialCharacter = event => {
    var regex = new RegExp('^[a-zA-Z0-9_ ]+$');
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  };

  return (
    <>
      <PageHeader title="Add Distributor" />
      <Main>
        <ExportStyleWrap>
          <Cards headless>
            <Form name="addDistributor" form={form} onFinish={handleSubmit} layout="vertical">
              <Row gutter={25}>
                {/* <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item name="date" rules={[{ message: 'Please enter date', required: true }]} label="Date">
                    <Input placeholder="Lead Date" type="date" onChange={e => console.log(e.target.value)} />
                  </Form.Item>
                </Col> */}
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    label="Primary Contact No."
                    name="primaryNumber"
                    rules={[
                      {
                        required: true,
                        message: 'Please input Primary Number!',
                      },
                      // {
                      //   validator(_, value) {
                      //     if (!value || value.length === 10) {
                      //       return Promise.resolve();
                      //     }
                      //     return Promise.reject('Please enter 10 digit Number!');
                      //   },
                      // },
                    ]}
                  >
                    {/* <Input placeholder="Phone number" onChange={handleChange} type="number" /> */}
                    <PhoneInput
                      inputStyle={{
                        fontSize: '14px',
                        borderRadius: '4px',
                      }}
                      country={'in'}
                      value={primaryNumber}
                      onChange={phone => {
                        setPrimaryNumber(phone);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    label="Secondary Number"
                    name="secondaryNumber"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: 'Please input secondary Number!',
                    //   },
                    // ]}
                  >
                    {/* <Input placeholder="Secondary Number" onChange={handleChange} type="number" /> */}
                    <PhoneInput
                      inputStyle={{
                        fontSize: '14px',
                        borderRadius: '4px',
                      }}
                      country={'in'}
                      value={secondaryNumber}
                      onChange={phone => {
                        setSecondaryNumber(phone);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    name="name"
                    rules={[{ message: 'Please enter name', required: true }]}
                    label="Distributor Name"
                  >
                    <Input
                      placeholder="Full Name"
                      onKeyPress={specialCharacter}
                      maxLength="40"
                      onChange={handleChange}
                    />
                  </Form.Item>
                </Col>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    name="companyName"
                    //rules={[{ message: 'Please enter company name', required: true }]}
                    label="Distributor Company"
                  >
                    <Input placeholder="Company Name" maxLength="40" onChange={handleChange} />
                  </Form.Item>
                </Col>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    name="email"
                    rules={[{ message: 'Please enter email', required: true }]}
                    label="Distributor Email"
                  >
                    <Input placeholder="Email" onChange={handleChange} type="email" />
                  </Form.Item>
                </Col>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item label="Region" name="region">
                    <Input placeholder="Primary City" onChange={handleChange} />
                  </Form.Item>
                </Col>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    name="address"
                    label="Distributor Address"
                    //rules={[{ required: true, message: 'Please input Address!' }]}
                  >
                    <Input.TextArea rows={3} placeholder="Full Address" />
                  </Form.Item>
                </Col>
                {/* <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    name="comments"
                    label="Comments"
                    //rules={[{ required: true, message: 'Please input comments!' }]}
                  >
                    <Input.TextArea rows={3} placeholder="Comments" />
                  </Form.Item>
                </Col> */}

                {/* <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    name="status"
                    label="Distributor Status"
                    rules={[{ required: true, message: 'Please select status!' }]}
                  >
                    <Select style={{ width: '100%' }} placeholder="Select Status">
                      <Select.Option value="Open">Open</Select.Option>
                      <Select.Option value="OpenAttempted">Open Attempted</Select.Option>
                      <Select.Option value="CallOpenAttempted">Call Open Attempted</Select.Option>
                      <Select.Option value="Consideration">Consideration</Select.Option>
                      <Select.Option value="MeetingProposed">Meeting Proposed</Select.Option>
                      <Select.Option value="MeetingDone">Meeting Done</Select.Option>
                      <Select.Option value="Registered">Registered</Select.Option>
                      <Select.Option value="Lost">Lost</Select.Option>
                    </Select>
                  </Form.Item>
                </Col> */}
              </Row>
              <div className="sDash-button-grp">
                <Button className="btn-signin" htmlType="submit" type="primary" size="large">
                  {loading2 ? <Spin size="medium" /> : 'Add Distributor'}
                </Button>
              </div>
            </Form>
            <div>
              <p className="danger text-center" style={{ color: 'red', marginTop: '10px' }}>
                {flag2 ? error : ''}
              </p>
            </div>
          </Cards>
        </ExportStyleWrap>
      </Main>
    </>
  );
};

export default AddDistributor;
