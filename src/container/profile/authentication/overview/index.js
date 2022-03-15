import React from 'react';
import { Row, Col } from 'antd';
import { Aside, Content } from './style';
import Heading from '../../../../components/heading/heading';

const Layout = WraperContent => {
  return () => {
    return (
      <>
        <Row>
          <Col xxl={8} xl={9} lg={12} md={8} xs={24}>
            <Aside>
              <div className="auth-side-content">
                <img src={require('../../../../static/img/auth/topShape.png')} alt="" className="topShape" />
                <img src={require('../../../../static/img/auth/bottomShape.png')} alt="" className="bottomShape" />
                <Content>
                  <Heading as="h1">
                    <img
                      style={{ height: '50px' }}
                      src="https://frxnl.com/wp-content/uploads/2021/04/Final-LOGO_HW-1024x254-1.png"
                      alt="logo"
                    />
                  </Heading>
                  <br />
                  <h1 style={{ color: 'white', fontSize: '30px' }}>Let's Connect people with FRXNL.</h1>
                  <img
                    className="auth-content-figure"
                    src={require('../../../../static/img/auth/cover.png')}
                    alt="cover"
                    style={{ width: '90%' }}
                  />
                </Content>
              </div>
            </Aside>
          </Col>
          <Col xxl={16} xl={15} lg={12} md={16} xs={24}>
            <WraperContent />
          </Col>
        </Row>
      </>
    );
  };
};

export default Layout;
