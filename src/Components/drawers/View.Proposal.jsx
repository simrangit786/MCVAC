import React, { Component } from "react";
import {
  Button,
  Checkbox,
  Collapse,
  Drawer,
  Form,
  Input,
  Select,
  Table,
} from "antd";
import { Image as Images } from "../Images";
import { CaretRightOutlined } from "@ant-design/icons";
const { Panel } = Collapse;
const { Option } = Select;

function handleChange(value) {
  console.log(`selected ${value}`);
}

function callback(key) {
  console.log(key);
}

function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}

class ViewProposal extends Component {
  columns = [
    {
      title: "activity date",
      dataIndex: "activity_date",
    },
    {
      title: "Created",
      dataIndex: "created",
    },
  ];
  data = [
    {
      key: "1",
      activity_date: <div>Dec 01, 2019 11:21 AM</div>,
      created: <div>Created Work Order : 123-4567-890</div>,
    },
    {
      key: "2",
      activity_date: <div>Dec 01, 2019 11:21 AM</div>,
      created: <div>Created Work Order : 123-4567-890</div>,
    },
    {
      key: "3",
      activity_date: <div>Dec 01, 2019 11:21 AM</div>,
      created: <div>Created Work Order : 123-4567-890</div>,
    },
    {
      key: "4",
      activity_date: <div>Dec 01, 2019 11:21 AM</div>,
      created: <div>Created Work Order : 123-4567-890</div>,
    },
  ];

  parposalColumns = [
    {
      title: "Proposal name",
      dataIndex: "proposal_name",
    },
    {
      title: "Customer",
      dataIndex: "customer",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: <div className="position-relative">LAST ACTIVITY DATE</div>,
      dataIndex: "last_activity_date",
      sorter: true,
    },
  ];
  parposalData = [
    {
      key: "1",
      proposal_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.related_show_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Albertson’s</div>
        </div>
      ),
      customer: <div>(999) 000–0000</div>,
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Prospect
        </Button>
      ),
      last_activity_date: <div>Dec 2, 2019, 1:23 PM</div>,
    },
    {
      key: "2",
      proposal_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.related_show_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Albertson’s</div>
        </div>
      ),
      customer: <div>(999) 000–0000</div>,
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Prospect
        </Button>
      ),
      last_activity_date: <div>Dec 2, 2019, 1:23 PM</div>,
    },
    {
      key: "3",
      proposal_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            {/*<img src={Images.related_show_icon} alt="" className="img-fluid"/>*/}
          </div>
          <div className="name-id-details">Albertson’s</div>
        </div>
      ),
      customer: <div>(999) 000–0000</div>,
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Prospect
        </Button>
      ),
      last_activity_date: <div>Dec 2, 2019, 1:23 PM</div>,
    },
    {
      key: "4",
      proposal_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.related_show_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Albertson’s</div>
        </div>
      ),
      customer: <div>(999) 000–0000</div>,
      status: (
        <Button className="main-status-btn border-0 bg-transparent">
          Prospect
        </Button>
      ),
      last_activity_date: <div>Dec 2, 2019, 1:23 PM</div>,
    },
  ];

  taskColumns = [
    {
      title: "Task",
      dataIndex: "task",
      sorter: true,
    },
    {
      title: <div className="position-relative">DUe Date</div>,
      dataIndex: "due_date",
      sorter: true,
    },
  ];
  taskData = [
    {
      key: "1",
      task: (
        <div className="name-id-details">
          <Checkbox onChange={onChange}>Contact client for details </Checkbox>
        </div>
      ),
      due_date: <span className="main-status-btn approved-btn">Due Today</span>,
    },
    {
      key: "2",
      task: (
        <div className="name-id-details">
          <Checkbox onChange={onChange}>Contact client for details </Checkbox>
        </div>
      ),
      due_date: <span className="main-status-btn text-red">Apr 12, 2020</span>,
    },
    {
      key: "3",
      task: (
        <div className="name-id-details">
          <Checkbox onChange={onChange}>Contact client for details </Checkbox>
        </div>
      ),
      due_date: <span className="main-status-btn">Apr 12, 2020</span>,
    },
    {
      key: "4",
      task: (
        <div className="name-id-details">
          <Checkbox onChange={onChange}>Contact client for details </Checkbox>
        </div>
      ),
      due_date: <span className="main-status-btn">Apr 12, 2020</span>,
    },
  ];

  docsColumns = [
    {
      title: "Document Name",
      dataIndex: "docs_name",
    },
    {
      title: "File Type",
      dataIndex: "file_type",
    },
    {
      title: <div className="position-relative">Upload Date</div>,
      dataIndex: "upload_date",
      sorter: true,
    },
  ];
  docsData = [
    {
      key: "1",
      docs_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.docs_file_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Job Description</div>
        </div>
      ),
      file_type: <div>doc</div>,
      upload_date: <div>Sep 08, 2020 3:45 PM</div>,
    },
    {
      key: "2",
      docs_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.docs_file_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Job Description</div>
        </div>
      ),
      file_type: <div>doc</div>,
      upload_date: <div>Sep 08, 2020 3:45 PM</div>,
    },
    {
      key: "3",
      docs_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.docs_file_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Job Description</div>
        </div>
      ),
      file_type: <div>doc</div>,
      upload_date: <div>Sep 08, 2020 3:45 PM</div>,
    },
    {
      key: "4",
      docs_name: (
        <div className="d-flex align-items-center">
          <div className="name-id-img-div">
            <img src={Images.docs_file_icon} alt="" className="img-fluid" />
          </div>
          <div className="name-id-details">Job Description</div>
        </div>
      ),
      file_type: <div>doc</div>,
      upload_date: <div>Sep 08, 2020 3:45 PM</div>,
    },
  ];

  render() {
    return (
      <React.Fragment>
        <Drawer
          centered
          title={
            <div className="d-flex align-items-center justify-content-between">
              <div className="create-note-div d-flex align-items-center">
                <img
                  src={Images.view_peropsal_icon_head}
                  alt=""
                  className="img-fluid"
                />
                <div className="create-note-heading-drawer bg-transparent p-0">
                  Contacts
                </div>
              </div>
              <div className="d-flex align-items-center">
                <Button className="view-proposal-drawer-btn">
                  View Proposal
                </Button>
                <Button className="delete-btn-drawer p-0 border-0 bg-transparent">
                  <img
                    src={Images.more_table_elipsis_icon}
                    alt=""
                    className="img-fluid"
                  />
                </Button>
              </div>
            </div>
          }
          visible={this.props.visible}
          onOk={this.props.onClose}
          onCancel={this.props.onClose}
          onClose={this.props.onClose}
          className="main-drawer-div"
          width={"598px"}
          placement={"right"}
          closeIcon={
            <img
              src={Images.right_arrow_icon_drawer}
              alt=""
              className="img-fluid"
            />
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <div className="row mt-0 summary-info-inner-row">
                <div className="col-12">
                  <Collapse
                    defaultActiveKey={["1"]}
                    onChange={callback}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                  >
                    <Panel
                      header={
                        <div className="opportunity_info-collapse d-flexa align-items-center">
                          <span>Opportunity Info</span>
                          <Button className="edit-btn-summary">
                            <img
                              src={Images.pencil_green}
                              alt=""
                              className="img-fluid"
                            />
                            Edit
                          </Button>
                        </div>
                      }
                      key="1"
                    >
                      <div className="row summary-collapse-inner-row-main">
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                          <h6 className="text-uppercase">OPPORTUNITY NAME</h6>
                          <h5>Carpet Cleaning</h5>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                          <h6 className="text-uppercase">SALESPERSON</h6>
                          <h5>Alphonso Mourody</h5>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                          <h6 className="text-uppercase">SALES ASSISTANT</h6>
                          <h5>-</h5>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                          <h6 className="text-uppercase">SALES MANAGER</h6>
                          <h5>Catherine Garcia</h5>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                          <h6 className="text-uppercase">STATUS</h6>
                          <Select
                            className="status-small-select"
                            placeholder={"Prospect"}
                            style={{ width: 87 }}
                            onChange={handleChange}
                            suffixIcon={
                              <img
                                src={Images.caret_small_icon_select}
                                alt=""
                                className="img-fluid"
                              />
                            }
                          >
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="disabled" disabled>
                              Disabled
                            </Option>
                            <Option value="Yiminghe">yiminghe</Option>
                          </Select>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                          <h6 className="text-uppercase">OPPORTUNITY SOURCE</h6>
                          <h5 className="mb-0">Referral</h5>
                        </div>
                        <div className="col-12 col-sm-6 col-md-4 col-lg-6">
                          <h6 className="text-uppercase">DESCRIPTION</h6>
                          <h5 className="mb-0">
                            Chance to clean 23 carpets at the local carpet
                            store.
                          </h5>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>
                </div>

                <div className="col-12">
                  <div className="row mx-0 summary-info-header-inner-row">
                    <div className="col-12 ">
                      <div className="row new-opportunity-header-row summary-header-details align-items-center justify-content-between carpet-cleaning-mini-header">
                        <div className="d-flex align-items-center">
                          <h6 className="mb-0">Project / Opportunity</h6>
                        </div>
                        <Button className="view-all-btn text-uppercase">
                          VIEW
                        </Button>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="row contact-account-card-row align-items-center justify-content-between">
                        <div className="account-contact-card w-100 border-0">
                          <div className="row">
                            <div className="col-12">
                              <div className="info-icon-card-flag float-left">
                                <img
                                  src={Images.folder_icon_main}
                                  alt=""
                                  className="img-fluid"
                                />
                              </div>
                              <div className="info-icon-card-details float-left">
                                <h5 className="d-flex align-items-center justify-content-between mb-0">
                                  <aside>Hudson Cleanup</aside>
                                  <span className="text-uppercase">Owner</span>
                                </h5>
                                <p className="font-weight-normal">
                                  Oil Service LTD
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="row mx-0 summary-info-header-inner-row">
                    <div className="col-12 ">
                      <div className="row new-opportunity-header-row summary-header-details align-items-center justify-content-between carpet-cleaning-mini-header">
                        <div className="d-flex align-items-center">
                          <h6 className="mb-0">Notes (0)</h6>
                          <div className="new-opportunity-btn-div">
                            <Button className="ant-dropdown-link new-opportunity-btn text-capitalize">
                              New Note
                            </Button>
                          </div>
                        </div>
                        <Button className="view-all-btn text-uppercase">
                          VIEW ALL{" "}
                        </Button>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="row contact-account-card-row align-items-center">
                        <div className="account-contact-card border-0 w-100">
                          <div className="row">
                            <div className="col-12">
                              <div className="info-icon-card-flag float-left">
                                <img
                                  src={Images.notes_icon_img}
                                  alt=""
                                  className="img-fluid"
                                />
                              </div>
                              <div className="info-icon-card-details float-left">
                                <h5 className="d-flex align-items-center mb-0">
                                  Contact Client
                                </h5>
                                <p className="font-weight-normal p-0">
                                  Contact client about Special tools
                                  <div className="d-flex align-items-center">
                                    <span className="span-tg-summary d-inline-block overflow-hidden">
                                      needed, details to be dis
                                    </span>
                                    <a href="#">Read More</a>
                                  </div>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="row mx-0 summary-info-header-inner-row">
                    <div className="col-12 ">
                      <div className="row new-opportunity-header-row summary-header-details align-items-center justify-content-between carpet-cleaning-mini-header">
                        <div className="d-flex align-items-center">
                          <h6 className="mb-0">Activity</h6>
                        </div>
                        <Button className="view-all-btn text-uppercase">
                          VIEW ALL{" "}
                        </Button>
                      </div>
                    </div>
                    <div className="col-12 table-responsive main-table-div">
                      <Table
                        pagination={false}
                        className="main-table-all border-0 rounded-0 carpet-cleaning-table activity-info-table"
                        columns={this.columns}
                        dataSource={this.data}
                        size="middle"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="row mx-0 summary-info-header-inner-row">
                    <div className="col-12 ">
                      <div className="row new-opportunity-header-row summary-header-details align-items-center justify-content-between carpet-cleaning-mini-header">
                        <div className="d-flex align-items-center">
                          <h6 className="mb-0">Tasks (15)</h6>
                          <div className="search-bar-div">
                            <Form className="position-relative">
                              <Input placeholder="Search Tasks" />
                              <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                                <img
                                  src={Images.search_icon_gray}
                                  className="img-fluid"
                                  alt="search icon"
                                />
                              </Button>
                            </Form>
                          </div>
                          <div className="new-opportunity-btn-div">
                            <Button className="ant-dropdown-link new-opportunity-btn text-capitalize">
                              New Tasks
                            </Button>
                          </div>
                        </div>
                        <Button className="view-all-btn text-uppercase">
                          VIEW ALL{" "}
                        </Button>
                      </div>
                    </div>

                    <div className="col-12 table-responsive main-table-div">
                      <Table
                        pagination={false}
                        className="main-table-all border-0 carpet-cleaning-table"
                        columns={this.taskColumns}
                        dataSource={this.taskData}
                        size="middle"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="row mx-0 summary-info-header-inner-row">
                    <div className="col-12 ">
                      <div className="row new-opportunity-header-row summary-header-details align-items-center justify-content-between carpet-cleaning-mini-header">
                        <div className="d-flex align-items-center">
                          <h6 className="mb-0">Accounts (10)</h6>
                          <div className="new-opportunity-btn-div">
                            <Button className="ant-dropdown-link new-opportunity-btn text-capitalize">
                              Add Account
                            </Button>
                          </div>
                        </div>
                        <Button className="view-all-btn text-uppercase">
                          VIEW{" "}
                        </Button>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="row contact-account-card-row align-items-center">
                        <div className="account-contact-card w-100 position-relative border-0">
                          <div className="row">
                            <div className="col-12">
                              <div className="info-icon-card-flag float-left">
                                <img
                                  src={Images.dollor_file_icon}
                                  alt=""
                                  className="img-fluid"
                                />
                              </div>
                              <div className="info-icon-card-details float-left">
                                <h5 className="d-flex align-items-center mb-0">
                                  Clean Carpets 101{" "}
                                  <span className="text-uppercase text-primary">
                                    Customer
                                  </span>
                                </h5>
                                <p className="font-weight-normal">
                                  123 State Street, New York, NY
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button className="contact-btn-small border-0 p-0 text-uppercase position-absolute">
                            Contacts{" "}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="row mx-0 summary-info-header-inner-row">
                    <div className="col-12 ">
                      <div className="row new-opportunity-header-row summary-header-details align-items-center justify-content-between carpet-cleaning-mini-header">
                        <div className="d-flex align-items-center">
                          <h6 className="mb-0">Contacts (10)</h6>
                          <div className="new-opportunity-btn-div">
                            <Button className="ant-dropdown-link new-opportunity-btn text-capitalize">
                              Add Contact
                            </Button>
                          </div>
                        </div>
                        <Button className="view-all-btn text-uppercase">
                          VIEW{" "}
                        </Button>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="row contact-account-card-row align-items-center">
                        <div className="account-contact-card w-100 position-relative border-0">
                          <div className="row">
                            <div className="col-12">
                              <div className="info-icon-card-flag float-left">
                                <img
                                  src={Images.contact_union_icon}
                                  alt=""
                                  className="img-fluid"
                                />
                              </div>
                              <div className="info-icon-card-details float-left">
                                <h5 className="d-flex align-items-center mb-0">
                                  Chris Borelli
                                  <span className="text-uppercase text-secondary">
                                    Manager
                                  </span>
                                </h5>
                                <p className="font-weight-normal">
                                  Cborelli@email.com
                                </p>
                                <p className="font-weight-normal mt-0">
                                  (415) 891-2345
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button className="contact-btn-small border-0 p-0 text-uppercase position-absolute">
                            Accounts{" "}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default ViewProposal;
