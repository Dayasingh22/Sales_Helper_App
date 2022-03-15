import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Form, Spin, Modal, Select, Tooltip } from 'antd';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, ExportStyleWrap, TableWrapper } from '../../styled';
import { UserTableStyleWrapper } from '../style';
import FeatherIcon from 'feather-icons-react';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import Heading from '../../../components/heading/heading';
import { useHistory, useParams } from 'react-router-dom';
import _ from 'lodash';
import axios from 'axios';
import { getItem } from '../../../utility/localStorageControl';
import { Auth } from '@aws-amplify/auth';

const EditDistributor = props => {
  const { singleUser } = props;
  const { id } = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const [loading2, setLoading2] = useState(false);
  const [flag2, setFlag2] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('');
  const [statusHistory, setStatusHistory] = useState([]);
  const [lostReason, setLostReason] = useState('');

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

  // useEffect(() => {
  //   getOneUser();
  // }, []);

  useEffect(() => {
    if (singleUser !== null) {
      setStatus(singleUser.status);
      setStatusHistory(singleUser.history);
      form.setFieldsValue({
        date: singleUser.leadDate,
        primaryNumber: singleUser.primaryNumber,
        secondaryNumber: singleUser.secondaryNumber,
        name: singleUser.name,
        companyName: singleUser.company,
        email: singleUser.email,
        address: singleUser.address,
        region: singleUser.region,
        status: singleUser.status,
        comments: singleUser.comments,
        callBackDate: singleUser.callOpen.callBackDate === '' ? '' : singleUser.callOpen.callBackDate,
        callBackTime: singleUser.callOpen.callBackTime === '' ? '' : singleUser.callOpen.callBackTime,
        callBackDate1: singleUser.meetingProposed.callBackDate1 === '' ? '' : singleUser.meetingProposed.callBackDate1,
        callBackTime1: singleUser.meetingProposed.callBackTime1 === '' ? '' : singleUser.meetingProposed.callBackTime1,
        meetingDate: singleUser.meetingDone === '' ? '' : singleUser.meetingDone,
        revisit1: singleUser.revisit1 === '' ? '' : singleUser.revisit1,
        revisit2: singleUser.revisit2 === '' ? '' : singleUser.revisit2,
        registeredDate: singleUser.registered === '' ? '' : singleUser.registered,
        lostReason: singleUser.lost.reason === '' ? '' : singleUser.lost.reason,
        product: singleUser.lost.product === '' ? '' : singleUser.lost.product,
        lostReasonComment: singleUser.lost.other === '' ? '' : singleUser.lost.other,
      });
    }
  }, [singleUser]);

  // const getOneUser = () => {
  //   const jwtToken = getItem('jwt');
  //   const api = process.env.REACT_APP_BACKEND_API;
  //   const URL = `${api}distributors/user/${id}`;
  //   var config = {
  //     method: 'get',
  //     url: URL,
  //     headers: {
  //       'x-access-token': `${jwtToken.token}`,
  //     },
  //   };
  //   axios(config)
  //     .then(function(response) {
  //       const result = response.data;
  //       console.log(result);
  //       setStatus(result.status);
  //       form.setFieldsValue({
  //         date: result.leadDate,
  //         primaryNumber: result.primaryNumber,
  //         secondaryNumber: result.secondaryNumber,
  //         name: result.name,
  //         companyName: result.company,
  //         email: result.email,
  //         address: result.address,
  //         region: result.region,
  //         status: result.status,
  //         comments: result.comments,
  //         callBackDate: result.callOpen.callBackDate === '' ? '' : result.callOpen.callBackDate,
  //         callBackTime: result.callOpen.callBackTime === '' ? '' : result.callOpen.callBackTime,
  //         callBackDate1: result.meetingProposed.callBackDate1 === '' ? '' : result.meetingProposed.callBackDate1,
  //         callBackTime1: result.meetingProposed.callBackTime1 === '' ? '' : result.meetingProposed.callBackTime1,
  //         meetingDate: result.meetingDone === '' ? '' : result.meetingDone,
  //         revisit1: result.revisit1 === '' ? '' : result.revisit1,
  //         revisit2: result.revisit2 === '' ? '' : result.revisit2,
  //         registeredDate: result.registered === '' ? '' : result.registered,
  //         lostReason: result.lost.reason === '' ? '' : result.lost.reason,
  //         product: result.lost.product === '' ? '' : result.lost.product,
  //         lostReasonComment: result.lost.other === '' ? '' : result.lost.other,
  //       });
  //       setLoading(false);
  //     })
  //     .catch(function(error) {
  //       console.log(error);
  //     });
  // };

  const handleSubmit = values => {
    console.log(values);
    let his = {
      status: values.status,
      date: new Date().toISOString().split('T')[0],
    };
    let arr = statusHistory;
    arr.push(his);
    console.log(arr);
    setLoading2(true);
    const jwtToken = getItem('jwt');
    const api = process.env.REACT_APP_BACKEND_API;
    const distributorValues = {
      leadDate: values.date,
      primaryNumber: values.primaryNumber,
      secondaryNumber: values.secondaryNumber,
      name: values.name,
      company: values.companyName,
      email: values.email,
      address: values.address,
      region: values.region,
      status: values.status,
      comments: values.comments,
      callOpen: {
        callBackDate: values.callBackDate === undefined ? '' : values.callBackDate,
        callBackTime: values.callBackTime === undefined ? '' : values.callBackTime,
      },
      meetingProposed: {
        callBackDate: values.callBackDate1 === undefined ? '' : values.callBackDate1,
        callBackTime: values.callBackTime1 === undefined ? '' : values.callBackTime1,
      },
      meetingDone: values.meetingDate === undefined ? '' : values.meetingDate,
      revisit1: values.revisit1 === undefined ? '' : values.revisit1,
      revisit2: values.revisit2 === undefined ? '' : values.revisit2,
      registered: values.registeredDate === undefined ? '' : values.registeredDate,
      lost: {
        reason: values.lostReason === undefined ? '' : values.lostReason,
        product: values.product === undefined ? '' : values.product,
        other: values.lostReasonComment === undefined ? '' : values.lostReasonComment,
      },
      modifiedBy: {
        name: user.user.attributes.name,
        email: user.user.attributes.email,
      },
      history: arr,
    };
    if (values.registeredDate !== '') {
      var config = {
        method: 'post',
        url: `https://app.frxnl.com/api/notify.php?e=1&email=${singleUser.email}&subject=test&body=test`,
        headers: {
          'Access-Control-Allow-Origin': `*`,
        },
        // data: distributorValues,
      };
      axios(config)
        .then(function(response) {
          setLoading2(false);
          const result = response.data;
          console.log(result);
          // history.push({
          //   pathname: '/admin/list',
          //   state: { detail: `${values.name} Updated Successfully` },
          // });
          props.onAddEditUser(`${singleUser.name} has been successfully Sent Welcome Email.`);
          props.onCancel();
        })
        .catch(function(error) {
          setLoading2(false);
          setFlag2(true);
          //setError('This Email already exists in database');
          console.log(error);
        });
    }
    const URL = `${api}distributors/update-user/${singleUser._id}`;
    var config = {
      method: 'put',
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
        // history.push({
        //   pathname: '/admin/list',
        //   state: { detail: `${values.name} Updated Successfully` },
        // });
        // if (values.registeredDate === '') {

        // }
        props.onAddEditUser(`${singleUser.name} has been successfully Updated.`);
        props.onCancel();
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

  const handleStatusChange = e => {
    setStatus(e);
  };

  const handleLostReasonChange = e => {
    setLostReason(e);
  };

  return (
    <>
      <Modal
        title={props.title}
        wrapClassName={props.wrapClassName}
        visible={props.visible}
        footer={null}
        onCancel={props.onCancel}
      >
        <Form name="editDistributor" form={form} onFinish={handleSubmit} layout="vertical">
          {/* <p style={{ textAlign: 'center', color: 'green' }}>You can edit only Seconday Number, Comments and Status</p> */}
          <Row gutter={25}>
            {/* <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
              <Tooltip title="You can't edit this field">
                <Form.Item name="date" rules={[{ message: 'Please enter date', required: true }]} label="Date">
                  <Input placeholder="Lead Date" type="date" onChange={handleChange} readOnly />
                </Form.Item>
              </Tooltip>
            </Col>
            <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
              <Tooltip title="You can't edit this field">
                <Form.Item
                  label="Primary Contact No."
                  name="primaryNumber"
                  rules={[
                    {
                      required: true,
                      message: 'Please input Primary Number!',
                    },
                  ]}
                >
                  <Input placeholder="Phone number" onChange={handleChange} type="number" readOnly />
                </Form.Item>
              </Tooltip>
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
                <Input placeholder="Secondary Number" onChange={handleChange} type="number" />
              </Form.Item>
            </Col>
            <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
              <Tooltip title="You can't edit this field">
                <Form.Item
                  name="name"
                  rules={[{ message: 'Please enter name', required: true }]}
                  label="Distributor Name"
                >
                  <Input placeholder="Full Name" onChange={handleChange} readOnly />
                </Form.Item>
              </Tooltip>
            </Col>
            <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
              <Tooltip title="You can't edit this field">
                <Form.Item
                  name="companyName"
                  //rules={[{ message: 'Please enter company name', required: true }]}
                  label="Distributor Company"
                >
                  <Input placeholder="Company Name" maxLength="40" onChange={handleChange} readOnly />
                </Form.Item>
              </Tooltip>
            </Col>
            <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
              <Tooltip title="You can't edit this field">
                <Form.Item
                  name="email"
                  rules={[{ message: 'Please enter email', required: true }]}
                  label="Distributor Email"
                >
                  <Input placeholder="Email" onChange={handleChange} type="email" readOnly />
                </Form.Item>
              </Tooltip>
            </Col>
            <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
              <Tooltip title="You can't edit this field">
                <Form.Item
                  name="address"
                  label="Distributor Address"
                  //rules={[{ required: true, message: 'Please input Address!' }]}
                >
                  <Input.TextArea rows={3} placeholder="Full Address" readOnly />
                </Form.Item>
              </Tooltip>
            </Col> */}
            <Col xxl={24} xl={24} lg={24} md={24} xs={24}>
              <Form.Item
                name="comments"
                label="Comments"
                //rules={[{ required: true, message: 'Please input comments!' }]}
              >
                <Input.TextArea rows={3} placeholder="Comments" />
              </Form.Item>
            </Col>
            {/* <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
              <Tooltip title="You can't edit this field">
                <Form.Item
                  label="Region"
                  name="region"
                  //rules={[{ required: true, message: 'Please input Region!' }]}
                >
                  <Input placeholder="Primary City" onChange={handleChange} readOnly />
                </Form.Item>
              </Tooltip>
            </Col> */}
            <Col xxl={24} xl={24} lg={24} md={24} xs={24}>
              <Form.Item
                name="status"
                label="Distributor Status"
                rules={[{ required: true, message: 'Please select status!' }]}
              >
                <Select style={{ width: '100%' }} placeholder="Select Status" onChange={handleStatusChange}>
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
            </Col>

            {status === 'CallOpenAttempted' ? (
              <>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    label="Call Back Date"
                    name="callBackDate"
                    rules={[{ required: true, message: 'Please input call back date!' }]}
                  >
                    <Input placeholder="date" onChange={handleChange} type="date" />
                  </Form.Item>
                </Col>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    label="Call Back Time"
                    name="callBackTime"
                    rules={[{ required: true, message: 'Please input call back time!' }]}
                  >
                    <Input placeholder="time" onChange={handleChange} type="time" />
                  </Form.Item>
                </Col>
              </>
            ) : (
              ''
            )}
            {status === 'Consideration' ? (
              <>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    label="Call Back Date"
                    name="callBackDate"
                    rules={[{ required: true, message: 'Please input call back date!' }]}
                  >
                    <Input placeholder="date" onChange={handleChange} type="date" />
                  </Form.Item>
                </Col>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    label="Call Back Time"
                    name="callBackTime"
                    rules={[{ required: true, message: 'Please input call back time!' }]}
                  >
                    <Input placeholder="time" onChange={handleChange} type="time" />
                  </Form.Item>
                </Col>
              </>
            ) : (
              ''
            )}
            {status === 'MeetingProposed' ? (
              <>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    label="Call Back Date"
                    name="callBackDate1"
                    rules={[{ required: true, message: 'Please input call back date!' }]}
                  >
                    <Input placeholder="date" onChange={handleChange} type="date" />
                  </Form.Item>
                </Col>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    label="Call Back Time"
                    name="callBackTime1"
                    rules={[{ required: true, message: 'Please input call back time!' }]}
                  >
                    <Input placeholder="time" onChange={handleChange} type="time" />
                  </Form.Item>
                </Col>
              </>
            ) : (
              ''
            )}
            {status === 'MeetingDone' ? (
              <>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    label="Meeting Date"
                    name="meetingDate"
                    rules={[{ required: true, message: 'Please input meeting date!' }]}
                  >
                    <Input placeholder="date" onChange={handleChange} type="date" />
                  </Form.Item>
                </Col>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item label="Revisit 1" name="revisit1">
                    <Input placeholder="date" onChange={handleChange} type="date" />
                  </Form.Item>
                </Col>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item label="Revisit 2" name="revisit2">
                    <Input placeholder="date" onChange={handleChange} type="date" />
                  </Form.Item>
                </Col>
              </>
            ) : (
              ''
            )}
            {status === 'Lost' ? (
              <>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    label="Lost Reason"
                    name="lostReason"
                    rules={[{ required: true, message: 'Please select lost reason!' }]}
                  >
                    <Select style={{ width: '100%' }} placeholder="Reason" onChange={handleLostReasonChange}>
                      <Select.Option value="TicketSizeConcern">Ticket Size Concern</Select.Option>
                      <Select.Option value="DealsWithADifferentProduct">Deals with a different Product</Select.Option>

                      <Select.Option value="SecurityConcerns">Security Concerns</Select.Option>
                      <Select.Option value="Others">Others</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </>
            ) : (
              ''
            )}
            {status === 'Registered' ? (
              <>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    label="Date"
                    name="registeredDate"
                    rules={[{ required: true, message: 'Please input registration date!' }]}
                  >
                    <Input placeholder="date" onChange={handleChange} type="date" />
                  </Form.Item>
                </Col>
              </>
            ) : (
              ''
            )}
            {lostReason === 'Others' ? (
              <>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    label="Comment"
                    name="lostReasonComment"
                    rules={[{ required: true, message: 'Please input comment!' }]}
                  >
                    <Input placeholder="Comment" onChange={handleChange} />
                  </Form.Item>
                </Col>
              </>
            ) : (
              ''
            )}
            {lostReason === 'DealsWithADifferentProduct' ? (
              <>
                <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                  <Form.Item
                    label="Which Product"
                    name="product"
                    rules={[{ required: true, message: 'Please input product!' }]}
                  >
                    <Input placeholder="Product Name" onChange={handleChange} />
                  </Form.Item>
                </Col>
              </>
            ) : (
              ''
            )}
          </Row>
          <div className="sDash-button-grp">
            <Button className="btn-signin" htmlType="submit" type="secondary" size="large">
              {loading2 ? <Spin size="medium" /> : 'Update'}
            </Button>
          </div>
        </Form>

        <div>
          <p className="danger text-center" style={{ color: 'red', marginTop: '10px' }}>
            {flag2 ? error : ''}
          </p>
        </div>
      </Modal>
    </>
  );
};

export default EditDistributor;
