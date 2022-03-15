import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Modal, Input, Select, Alert, Skeleton, Form, Tooltip } from 'antd';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main, ExportStyleWrap, TableWrapper } from '../../styled';
import { UserTableStyleWrapper } from '../style';
import FeatherIcon from 'feather-icons-react';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import { alertModal } from '../../../components/modals/antd-modals';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { getItem } from '../../../utility/localStorageControl';
import DistributorDetails from './DistributorDetails';
import EditDistributor from './EditDistributor';

const DistributorList = () => {
  const { Column } = Table;
  const location = useLocation();
  const history = useHistory();
  const [selectFilter, setSelectFilter] = useState('');
  const [show, setShow] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [reference, setReference] = useState([]);
  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [loading2, setLoading2] = useState(true);
  const [showModal2, setShowModal2] = useState(false);
  const [singleUser, setSingleUser] = useState(null);
  const [state, setState] = useState({
    isModalVisible: false,
    fileName: 'frxnl',
    convertedTo: 'csv',
    selectedRowKeys: 0,
    selectedRows: [],
  });
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  const showModal3 = () => {
    setIsModalVisible2(true);
  };
  const handleCancel3 = () => {
    getAllDistributors();
    setIsModalVisible2(false);
  };

  const showModal = () => {
    setState({
      ...state,
      isModalVisible: true,
    });
  };
  const handleCancel = () => {
    setState({
      ...state,
      isModalVisible: false,
    });
  };

  const csvData = [['name', 'email', 'phone', 'region', 'company', 'status']];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setState({ ...state, selectedRowKeys, selectedRows });
    },
    getCheckboxProps: record => {
      return {
        disabled: record.action.props.children[0].props.children === true,
      };
    },
  };

  state.selectedRows.map(users => {
    const { name, email, phone, region, company, distributorStatus } = users;
    return csvData.push([name, email, phone.props.children, region, company, distributorStatus]);
  });

  const { isModalVisible } = state;

  const warning = () => {
    alertModal.warning({
      title: 'Please Select Required Rows!',
    });
  };

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const xlsxExtension = '.xlsx';

  const exportToXLSX = (inputData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(inputData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + xlsxExtension);
    setState({
      ...state,
      isModalVisible: false,
    });
  };

  const updateFileName = e => {
    setState({
      ...state,
      fileName: e.target.value,
    });
  };
  const updateFileType = value => {
    setState({
      ...state,
      convertedTo: value,
    });
  };
  const { Option } = Select;
  const { fileName, convertedTo } = state;

  useEffect(() => {
    if (location.state !== null && location.state !== undefined) {
      setShowAlert(true);
      setAlertText(location.state.detail);
      setAlertType('success');
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  }, []);

  useEffect(() => {
    getAllDistributors();
  }, []);

  const getAllDistributors = () => {
    const jwtToken = getItem('jwt');
    const api = process.env.REACT_APP_BACKEND_API;
    const URL = `${api}distributors`;
    var config = {
      method: 'get',
      url: URL,
      headers: {
        'x-access-token': `${jwtToken.token}`,
      },
    };
    axios(config)
      .then(function(response) {
        const result = response.data;
        const distributors = result.reverse();
        let usersTableData = [];
        distributors.map(user => {
          const { _id, name, email, primaryNumber, company, region, status, wrongLead, leadDate } = user;
          let ss = '';
          if (status === 'OpenAttempted') {
            ss = 'Open Attempted';
          } else if (status === 'CallOpenAttempted') {
            ss = 'Call Open Attempted';
          } else if (status === 'MeetingProposed') {
            ss = 'Meeting Proposed';
          } else if (status === 'MeetingDone') {
            ss = 'Meeting Done';
          } else {
            ss = status;
          }
          return usersTableData.push({
            key: _id,
            name: name,
            email: email,
            phone: <a href={`tel:${primaryNumber}`}>{primaryNumber}</a>,
            region: region,
            company: company,
            // distributorStatus: (
            //   <span className={`status ${status === 'active' ? 'Success' : status === 'unactive' ? 'error' : 'error'}`}>
            //     {status}
            //   </span>
            // ),
            distributorStatus: ss,
            action: (
              <>
                <div>{wrongLead}</div>
                <Tooltip title="Wrong Lead">
                  <Button className="btn-icon" shape="circle" onClick={() => wrongLeadStatus(user)}>
                    <FeatherIcon icon="trash" size={16} />
                  </Button>
                </Tooltip>
                <Tooltip title="Update">
                  <Button
                    className="btn-icon"
                    shape="circle"
                    onClick={() => {
                      showModal3();
                      setSingleUser(user);
                      //history.push(`/admin/edituser/${_id}`);
                    }}
                  >
                    <FeatherIcon icon="edit" size={16} />
                  </Button>
                </Tooltip>
                <Tooltip title="Details">
                  <Button className="btn-icon" shape="circle" onClick={() => details(user)}>
                    <FeatherIcon icon="eye" size={16} />
                  </Button>
                </Tooltip>
                <Tooltip title="Send Whatsapp Message">
                  <a
                    href={`https://api.whatsapp.com/send?phone=${primaryNumber}&text=Welcome to Frxnl`}
                    target="_blank"
                  >
                    <FeatherIcon icon="message-circle" size={16} />
                  </a>
                </Tooltip>
              </>
            ),
          });
        });
        setUsersData(usersTableData);
        setReference(usersTableData);
        setLoading2(false);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const wrongLeadStatus = user => {
    if (confirm(`Are You Sure `)) {
      const jwtToken = getItem('jwt');
      const api = process.env.REACT_APP_BACKEND_API;
      const URL = `${api}distributors/update-user/${user._id}`;
      var config = {
        method: 'put',
        url: URL,
        headers: {
          'x-access-token': `${jwtToken.token}`,
        },
        data: {
          wrongLead: true,
        },
      };
      axios(config)
        .then(function(response) {
          setShowAlert(true);
          setAlertText(`Distributor Successfully Updated`);
          setAlertType('success');
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
          getAllDistributors();
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };

  const usersTableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      sorter: (a, b) => {
        return a.name.toString().localeCompare(b.name.toString());
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      sorter: (a, b) => {
        return a.email.toString().localeCompare(b.email.toString());
      },
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 200,
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      width: 200,
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      width: 180,
      sorter: (a, b) => {
        return a.area.toString().localeCompare(b.area.toString());
      },
    },
    {
      title: 'Distributor Status',
      dataIndex: 'distributorStatus',
      key: 'distributorStatus',
      width: 150,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 280,
    },
  ];

  const selectedFilter = e => {
    setShow(true);
    setSelectFilter(e);
  };

  const filterFunction = e => {
    var selectedFilter = selectFilter;
    var x = 1;
    if (selectedFilter === 'name') {
      x = 1;
    }
    if (selectedFilter === 'email') {
      x = 2;
    }
    if (selectedFilter === 'phone') {
      x = 3;
    }
    if (selectedFilter === 'region') {
      x = 4;
    }
    if (selectedFilter === 'company') {
      x = 5;
    }

    if (x === 1) {
      const currValue = e.target.value.toLowerCase();
      const filteredData = reference.filter(entry => entry.name.toLowerCase().includes(currValue));
      setUsersData(filteredData);
    }
    if (x === 2) {
      const currValue = e.target.value.toLowerCase();
      const filteredData = reference.filter(entry => entry.email.toLowerCase().includes(currValue));
      setUsersData(filteredData);
    }
    if (x === 3) {
      const currValue = e.target.value.toLowerCase();

      const filteredData = reference.filter(entry =>
        entry.phone.props.children
          .toString()
          .toLowerCase()
          .includes(currValue),
      );
      setUsersData(filteredData);
    }
    if (x === 4) {
      const currValue = e.target.value.toLowerCase();
      const filteredData = reference.filter(entry => entry.region.toLowerCase().includes(currValue));
      setUsersData(filteredData);
    }
    if (x === 5) {
      const currValue = e.target.value.toLowerCase();
      const filteredData = reference.filter(entry => entry.company.toLowerCase().includes(currValue));
      setUsersData(filteredData);
    }
  };

  const addDistributor = () => {
    history.push('/admin/add');
  };

  const deleteUser = (id, name) => {
    if (confirm(`Are You Sure to Delete  ${name} Distributor `)) {
      const jwtToken = getItem('jwt');
      const api = process.env.REACT_APP_BACKEND_API;
      const URL = `${api}distributors/delete-user/${id}`;
      var config = {
        method: 'delete',
        url: URL,
        headers: {
          'x-access-token': `${jwtToken.token}`,
        },
      };
      axios(config)
        .then(function(response) {
          setShowAlert(true);
          setAlertText(`Distributor Successfully Deleted`);
          setAlertType('success');
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
          getAllDistributors();
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };

  const details = user => {
    setSingleUser(user);
    setShowModal2(true);
  };

  const handleCancel2 = () => {
    setShowModal2(false);
  };

  const addEditUser = val => {
    setShowAlert(true);
    setAlertText(val);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <>
      <PageHeader title="Distributor List" />
      <Main>
        <Row gutter={25}>
          <Col sm={24} xs={24}>
            <ExportStyleWrap>
              <Cards headless>
                <DistributorDetails
                  title="Distributor Details"
                  wrapClassName="sDash_export-wrap"
                  visible={showModal2}
                  footer={null}
                  onCancel={handleCancel2}
                  singleUser={singleUser}
                />
                <div className="sDash_export-box" style={{ marginBottom: '20px' }}>
                  <div>
                    <Button className="btn-export" type="primary" size="medium" onClick={addDistributor}>
                      Add Distributor
                    </Button>
                    {state.selectedRows.length ? (
                      <>
                        <Button
                          className="btn-export"
                          onClick={showModal}
                          type="secondary"
                          style={{ marginLeft: '10px' }}
                        >
                          Export
                        </Button>
                        <Modal
                          title="Export File"
                          wrapClassName="sDash_export-wrap"
                          visible={isModalVisible}
                          footer={null}
                          onCancel={handleCancel}
                        >
                          <Form name="contact">
                            <Form.Item name="f_name">
                              <Input placeholder="File Name" value={fileName} onChange={updateFileName} />
                            </Form.Item>
                            <Form.Item name="f_type">
                              <Select defaultValue="CSV" onChange={updateFileType}>
                                <Option value="csv">CSV</Option>
                                <Option value="xlxs">xlxs</Option>
                              </Select>
                            </Form.Item>
                            <div className="sDash-button-grp">
                              {convertedTo === 'csv' ? (
                                <CSVLink filename={`${fileName}.csv`} data={csvData}>
                                  <Button onClick={handleCancel} className="btn-export" type="primary">
                                    Export
                                  </Button>
                                </CSVLink>
                              ) : (
                                <Button
                                  className="btn-export"
                                  onClick={() => exportToXLSX(csvData, fileName)}
                                  type="primary"
                                >
                                  Export
                                </Button>
                              )}
                              <Button htmlType="submit" onClick={handleCancel} size="default" type="white" outlined>
                                Cancel
                              </Button>
                            </div>
                          </Form>
                        </Modal>
                      </>
                    ) : (
                      <Button className="btn-export" onClick={warning} type="secondary" style={{ marginLeft: '10px' }}>
                        Export
                      </Button>
                    )}
                  </div>
                  <div>
                    <Select
                      // defaultValue="name"
                      placeholder="Search By"
                      style={{ marginRight: '10px' }}
                      onChange={selectedFilter}
                    >
                      <Select.Option value="name">Name</Select.Option>
                      <Select.Option value="email">Email</Select.Option>
                      <Select.Option value="phone">Phone</Select.Option>
                      <Select.Option value="region">Region</Select.Option>
                      <Select.Option value="company">Company</Select.Option>
                    </Select>
                    <Input
                      placeholder="Search Here"
                      style={{ width: '50%', height: '80%' }}
                      id="myInput"
                      onKeyUp={filterFunction}
                    />
                  </div>
                </div>
                <div
                  style={{
                    marginTop: '-20px',
                    marginBottom: '20px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showAlert ? <Alert message={alertText} type="success" showIcon /> : ''}
                </div>

                {loading2 === true ? (
                  <Skeleton active />
                ) : (
                  <UserTableStyleWrapper>
                    <TableWrapper className="table-responsive">
                      <Table
                        rowClassName={(record, index) =>
                          record.action.props.children[0].props.children === true ? 'redTable' : 'green'
                        }
                        id="myTable"
                        rowSelection={rowSelection}
                        columns={usersTableColumns}
                        scroll={{ y: 340, x: true }}
                        dataSource={usersData}
                        pagination={{
                          showSizeChanger: true,
                          pageSizeOptions: [`${usersData.length}`, '10', '30'],
                          defaultPageSize: 10,
                          total: usersData.length,
                          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        }}
                      />
                    </TableWrapper>
                  </UserTableStyleWrapper>
                )}
              </Cards>
            </ExportStyleWrap>
          </Col>
        </Row>
      </Main>
      <EditDistributor
        title="Edit Distributor"
        wrapClassName="sDash_export-wrap"
        visible={isModalVisible2}
        footer={null}
        onCancel={handleCancel3}
        onAddEditUser={addEditUser}
        singleUser={singleUser}
      />
    </>
  );
};

export default DistributorList;
