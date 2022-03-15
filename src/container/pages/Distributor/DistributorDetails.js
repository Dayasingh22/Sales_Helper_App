import React, { useState, useEffect } from 'react';
import { Modal, Col, Row, Form } from 'antd';
import { useHistory } from 'react-router-dom';
import { Button } from '../../../components/buttons/buttons';

const DistributorDetails = props => {
  const { singleUser } = props;
  const history = useHistory();
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(singleUser);
  }, [singleUser]);

  const handleSubmit = values => {
    console.log(values);
  };

  const editDistributor = id => {
    history.push(`/admin/edituser/${id}`);
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
        <Form name="adduser" form={form} onFinish={handleSubmit} layout="vertical">
          {user === null ? (
            ''
          ) : (
            <Row gutter={25}>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item name="date" label="Lead Date">
                  <p>{user.leadDate}</p>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item name="number" label="Primary Number">
                  <p>
                    <a href={`tel:${user.primaryNumber}`}>{user.primaryNumber}</a>
                  </p>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item name="name" label="Distributor Name">
                  <p>{user.name}</p>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item name="company" label="Company Name">
                  <p>{user.company}</p>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item name="email" label="Distributor Email">
                  <p>{user.email}</p>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item name="region" label="Distributor Region">
                  <p>{user.region}</p>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={8} xs={24}>
                <Form.Item name="status" label="Distributor Status">
                  <p>{user.status}</p>
                </Form.Item>
              </Col>
            </Row>
          )}
          {/* <div className="sDash-button-grp">
            <Button
              className="btn-signin"
              type="warning"
              size="large"
              onClick={() => {
                editDistributor(user._id);
              }}
            >
              Update Distributor
            </Button>
          </div> */}
        </Form>
      </Modal>
    </>
  );
};

export default DistributorDetails;
