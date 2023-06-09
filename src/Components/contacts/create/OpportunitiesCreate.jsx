import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Select,
  Spin,
  Table,
} from "antd";
import { Image as Images } from "../../Images";
import { createContactOppotunity, removeContactOppotunity } from '../../../Controller/api/contactsServices';
import { handleError } from '../../../Controller/Global';
import {
  createContact,
  getCustomerAccount,
  getOpportunities,
  getOwnerAccount,
} from "../../../Controller/api/opportunityServices";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class OpportunitiesCreate extends Component {
  state = {
    data: [],
    opportunities: [],
    fetching: false,
    loading: false,
  };
  formRef = React.createRef();
  menu = (record) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          onClick={() => this.removeOpportunity(record)}
          className="border-0 p-0 shadow-none bg-transparent"
        >
          Remove
        </Button>
      </Menu.Item>
      <Menu.Item key="1">
        <Button className="border-0 p-0 shadow-none bg-transparent">
          Edit
        </Button>
      </Menu.Item>
    </Menu>
  );

  opportunitiesColumns = [
    {
      title: "Opportunity name",
      // dataIndex: 'opportunity',
      sorter: true,
      render: (data) => (
        <div className="d-flex align-items-center">{data?.opportunity.name}</div>
      ),
    },
    {
      title: "Status",
      // dataIndex: 'opportunity',
      sorter: true,
      render: (data) => (
        <div className="font-weight-normal">{data?.opportunity.status?.title}</div>
      ),
    },
    {
      title: "OPPORTUNITY SOURCE",
      // dataIndex: 'opportunity',
      sorter: true,
      render: (data, record) => (
        <div className="font-weight-normal position-relative">
          {data?.opportunity.source?.name}
          <Dropdown
            overlayClassName="add-remove-dropdown-main table-add-remove"
            overlay={this.menu(record)}
            trigger={["click"]}
          >
            <Button
              className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
              onClick={(e) => e.preventDefault()}
            >
              <img src={Images.more_black} alt="" className="img-fluid" />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  removeOpportunity = (record) => {
    // if (record.account) {
    //     updateContact({contact: null}, record.id).then(res => {
    //         this.fetchOpportunity()
    //     }).catch(err => {
    //         if (err.response) {
    //             Object.keys(err.response.data).map((e) => {
    //                 message.error(err.response.data[e])
    //             })
    //         }
    //     })
    // } else {
      removeContactOppotunity(record.id).then(res => {
            this.props.fetchContacts()
        }).catch(err => {
            handleError(err)
        })
    // }
  };

  // fetchOpportunity = (params = {}) => {
  //   this.setState({ loading: true });
  //   if (this.props.contact?.account?.account_type == "SITE_OWNER") {
  //     getOwnerAccount({ contact: this.props.contact.id, ...params })
  //       .then((res) => {
  //         const opportunities = [];
  //         res.data.results.forEach((i) => {
  //           opportunities.push(i?.opportunity);
  //         });
  //         this.setState({ opportunities, loading: false });
  //       })
  //       .catch((err) => {
  //         if (err.response) {
  //           Object.keys(err.response.data).map((e) => {
  //             message.error(err.response.data[e]);
  //           });
  //         }
  //       });
  //   } else {
  //     getCustomerAccount({ contact: this.props.contact.id, ...params })
  //       .then(async (res) => {
  //         const opportunities = [];
  //         await res.data.results.forEach((i) => {
  //           opportunities.push(i?.opportunity);
  //         });
  //         // console.log(opportunities, "opportunities");
  //         this.setState({ opportunities: opportunities, loading: false });
  //       })
  //       .catch((err) => {
  //         if (err.response) {
  //           Object.keys(err.response.data).map((e) => {
  //             message.error(err.response.data[e]);
  //           });
  //         }
  //       });
  //   }
  // };

  handleChange = (e) => {
    let data = {
      opportunity: e,
      contact: this.props.contact.id,
    };
    createContactOppotunity(data)
      .then((res) => {
        // this.fetchOpportunity();
        this.props.fetchContacts(this.props.contact.id)
        this.formRef.current.resetFields();
      })
      .catch((err) => {
       handleError(err)
      });
  };

  fetchAllOpportunity = (params = {}) => {
    this.setState({ fetching: true });
    getOpportunities(params)
      .then((res) => {
        this.setState({ data: res.data.results, fetching: false });
      })
      .catch((err) => {
        handleError(err)
      });
    this.setState({ fetching: false });
  };

  componentDidMount() {
    if (this.props?.match?.params.id) {
      this.props.fetchContacts(this.props?.match?.params.id);
    }
  }

  onSearch = (e) => {
    this.fetchOpportunity({ search: e.target.value });
  };

  handleSubmit = () => {
    this.props.setContact(this.props.contact, 5);
    message.success("Contact updated successfully!");
  };

  render() {
    const { fetching, data } = this.state;
    const opportunities = this.props.contact?.contact_opportunity || [];

    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              {...layout}
              className="main-inner-form"
              onFinish={this.handleSubmit}
            >
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="opportunities"
                        label={"Opportunities *"}
                        rules={[
                          {
                            required: false,
                            message: "",
                          },
                        ]}
                        className="position-relative"
                      >
                        {/* <Input placeholder="Search" onChange={this.onSearch}/> */}
                        <Select
                          placeholder="Search Opportunities"
                          notFoundContent={
                            fetching ? <Spin size="small" /> : null
                          }
                          filterOption={false}
                          showSearch={true}
                          onFocus={() => this.fetchAllOpportunity()}
                          onSearch={(e) =>
                            this.fetchAllOpportunity({ search: e })
                          }
                          onChange={this.handleChange}
                        >
                          {data.map((d) => (
                            <Option key={d.id} value={d.id}>
                              {d.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                    {opportunities.length === 0 && (
                      <div className="col-12">
                        <div className="row mx-0 no-data-card-row align-items-center justify-content-center contacts-opportunity-empty">
                          <div className="col-12 text-center">
                            <img
                              src={Images.no_opportunities_icon}
                              alt=""
                              className="img-fluid"
                            />
                            <h6 className="mb-0 text-gray-tag">
                              No Opportunities
                            </h6>
                          </div>
                        </div>
                      </div>
                    )}
                    {opportunities.length > 0 && (
                      <div className="col-12 table-responsive px-3 main-table-div">
                        <Table
                          pagination={false}
                          loading={this.state.loading}
                          className="main-table-all border-0 carpet-cleaning-table"
                          columns={this.opportunitiesColumns}
                          dataSource={opportunities}
                          size="middle"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button className="validate-btn-main" htmlType="submit">
                      Save and Continue
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(OpportunitiesCreate);
