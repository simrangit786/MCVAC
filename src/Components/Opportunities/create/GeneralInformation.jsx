import React, { Component } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Select,
  Spin,
} from "antd";
import { Image as Images } from "../../Images";
import {
  createOpportunity,
  getSource,
  getStatusData,
  getStatusReasonOptions,
  updateOpportunity,
} from "../../../Controller/api/opportunityServices";
import { getUser } from "../../../Controller/api/authServices";
import { handleError, STATUS_TYPES } from "../../../Controller/Global";
import { withRouter } from "react-router-dom";
import OpportunityStatusModal, { opportunityStatusModal } from "../../modals/OpportunityStatusModal"
import moment from "moment";
import { BidSectorOptions } from "../../../Controller/opportunityBidSectorOptions";

const { Option } = Select;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { TextArea } = Input;
const types = {
  salesPerson: "salesperson",
  salesAssistant: "salesassistant",
  salesManager: "salesmanager",
};

const typeForm = {
  salesPerson: "sales_person",
  salesAssistant: "sales_assistant",
  salesManager: "sales_manager",
};

class GeneralInformation extends Component {
  state = {
    source: [],
    statusTypes: [],
    fetching: false,
    buttonLoading: false,
    reasonLoading: false,
    reasons: []
  };
  formRef = React.createRef();

  menu = (item, type) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          onClick={() => {
            this.removeUsers(item, type);
          }}
          className="border-0 bg-transparent text-center p-0 w-100"
        >
          Remove
        </Button>
      </Menu.Item>
    </Menu>
  );

  removeUsers = (item, type) => {
    this.setState({
      [`${type}Selected`]: this.state[`${type}Selected`].filter(
        (i) => i.id !== item.id
      ),
    });
    this.formRef.current.setFieldsValue({
      [typeForm[type]]: this.formRef.current
        .getFieldValue(typeForm[type])
        .filter((i) => i !== item.id),
    });
  };
  fetchSource = (search = {}) => {
    this.setState({ fetching: true });
    getSource(search)
      .then((res) => {
        this.setState({ source: res.data.results, fetching: false });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
        this.setState({ fetching: false });
      });
  };

  fetchUser = (type, search = {}) => {
    this.setState({ fetching: true });
    getUser(types[type], search)
      .then((res) => {
        this.setState({
          [type]: res.data.results,
          fetching: false,
        });
      })
      .catch((err) => {
        if (err.response) {
          Object.keys(err.response.data).map((e) => {
            message.error(err.response.data[e]);
          });
        }
        this.setState({ fetching: false });
      });
  };
  handleSelect = (e, type) => {
    let data = this.state[type].filter((i) => e.includes(i.id));
    this.setState({ [`${type}Selected`]: data });
  };
  
  showStatus = (visible) => {
    this.setState({visible: visible})
  }

  handleChange = (v) => {
    if (v.value == 12) {
      this.showStatus(true)     
    }
    else {
      this.handleUpdate(v)
    }

  }

  handleUpdate = (e) => {
    this.setState({modalData: e})
  }

  onSubmit = (values) => {
    console.log(values,"values")
    this.setState({ buttonLoading: true });
    const {modalData} = this.state;
    const newValues = {
      ...values,
      ...modalData,
      status: values.status.value,
      source: values.source.value,
      bid_date : values.bid_date?.format("YYYY-MM-DD"),
      bid_value: values.bid_value ? values.bid_value : null
    }
    values.source = values.source.key;
    values.status = values.status.value;
    if (this.props.opportunity) {
      updateOpportunity(this.props.opportunity?.id, newValues)
        .then((res) => {
          message.success("Opportunity Updated Successfully!");
          this.props.setOpportunity(res.data, 2);
          this.setState({ buttonLoading: false });
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
          this.setState({ buttonLoading: false });
        });
    } else {
      createOpportunity(newValues)
        .then((res) => {
          message.success("Opportunity Created Successfully!");
          this.props.setOpportunity(res.data, 2);
          this.setState({ buttonLoading: false });
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e], 3);
            });
          }
          this.setState({ buttonLoading: false });
        });
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.opportunity !== this.props.opportunity) {
      await this.formRef.current.setFieldsValue({
        ...this.props.opportunity,
        id: this.props.opportunity.id,
        name: this.props.opportunity.name,
        source: {
          key: this.props.opportunity.source.id,
          label: this.props.opportunity.source.name,
        },
        description: this.props.opportunity.description,
        status: {
          value: this.props.opportunity?.status?.id,
          label: this.props.opportunity?.status?.title,
        },
        estimated_revenue: this.props.opportunity.estimated_revenue,
        project_start_date: this.props.opportunity.project_start_date
          ? moment(this.props.opportunity.project_start_date)
          : null,
        project_end_date: this.props.opportunity.project_end_date
          ? moment(this.props.opportunity.project_end_date)
          : null,
        bid_date: this.props.opportunity?.bid_date ? 
         moment(this.props.opportunity?.bid_date) : null,
      });
    }
  }

  componentDidMount() {
    this.getStatusData();
  }

  getStatusData = () => {
    getStatusData()
      .then((res) => {
        this.setState({ statusTypes: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  getReasons = () => {
    this.setState({reasonLoading: true})
    getStatusReasonOptions().then(res => {
      this.setState({reasons: res.data.results, reasonLoading: false})
    }).catch(err => {
      handleError(err)
    })
  }

  render() {
    const { source, statusTypes, reasons, reasonLoading } = this.state;
    return (
      <React.Fragment>
        <div className="row common-form-card-row general-info">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Please input general information for opportunity.
              </h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              onFinish={this.onSubmit}
              requiredMark={false}
              ref={this.formRef}
              {...layout}
              className="main-inner-form"
            >
              <div className="row">
                {/*<div className="col-12 col-sm-6">*/}
                {/*    <Form.Item name="id" label={"Id"}>*/}
                {/*    <Input disabled={true} placeholder="Id" />*/}
                {/*    </Form.Item>*/}
                {/*    </div>*/}
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="name"
                    label={"Opportunity Name *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Input placeholder="Opportunity Name" />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="status"
                    label={"Status *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Select
                      labelInValue
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder="Status"
                      onChange={this.handleChange}
                    >
                      {statusTypes.map((item, index) => (
                        <Option value={item.id} key={item.id}>
                          {item.title}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="source"
                    label={"Opportunity Source *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      labelInValue
                      filterOption={false}
                      onSearch={(e) => this.fetchSource({ search: e })}
                      onFocus={() => this.fetchSource()}
                      notFoundContent={
                        this.state.fetching ? (
                          <Spin size="small" />
                        ) : (
                          "Not Found"
                        )
                      }
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder="Source"
                    >
                      {source.map((item) => (
                        <Option value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="estimated_revenue"
                    label={"Estimated Revenue"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                  >
                    <InputNumber
                      formatter={(value) =>
                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      placeholder={"$0.00"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="project_start_date"
                    label={"Estimated Project Start Date"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder={"mm/dd/yyyy"}
                      format={"MM/DD/YYYY"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="project_end_date"
                    label={"Estimated Project End Date"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder={"mm/dd/yyyy"}
                      format={"MM/DD/YYYY"}
                      disabledDate={(d) =>
                        d.isSameOrBefore(
                          this.formRef.current.getFieldValue(
                            "project_start_date"
                          )
                        )
                      }
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                      name="bid"
                      label={"Bid"}
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                  >
                    <Select
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder="Select"
                      // onChange={this.handleChange}
                    >
                        <Option value={"YES"} key={1}>
                          Yes
                        </Option>
                        <Option value={"NO"} key={2}>
                          No
                        </Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="bid_date"
                    label={"Bid Date"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder={"mm/dd/yyyy"}
                      format={"MM/DD/YYYY"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12">
                  <Form.Item
                   name="bid_link"
                   label={"Link to Bid Advertisement"}
                   rules={[
                    {
                      required: false,
                      // message: 'this field is required'
                    },
                  ]}>
                     <Input placeholder="www.website.com" />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                   name="bid_value"
                   label={"Total Bid Value"}
                   className={
                    // this.formRef.current?.getFieldValue(
                    //   "bid_value"
                    // )
                    //   ? 
                      "position-relative add-dollar-main-item color-change"
                      // : "position-relative add-dollar-main-item"
                  }
                   rules={[
                    {
                      required: false,
                      // message: 'this field is required'
                    },
                  ]}>
                     <InputNumber style={{ paddingLeft: "22px" }} />
                  </Form.Item>
                  <small className="add-dollar add-dollar-2 position-absolute">
                                $
                  </small>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="bid_sector"
                    label={"Bid Sector"}
                    rules={[
                      {
                        required: false,
                        message: "",
                      },
                    ]}
                  >
                    <Select
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder="Select"
                    >
                      {BidSectorOptions.map((item, index) => (
                        <Option value={item.value} key={item.value}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12">
                  <Form.Item
                    name="description"
                    label={"Description"}
                    rules={[
                      {
                        required: false,
                        // message: 'this field is required'
                      },
                    ]}
                  >
                    <TextArea
                      className="text-area-main"
                      placeholder={
                        "e.g. Project City, Project State, Project County, etc."
                      }
                    />
                  </Form.Item>
                </div>
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button
                      loading={this.state.buttonLoading}
                      htmlType={"submit"}
                      className="validate-btn-main"
                    >
                      Save and Continue
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        </div>
        <OpportunityStatusModal
          reasons={reasons}
          reasonLoading={reasonLoading}
          getReasons={this.getReasons}
          visible={this.state.visible}
          onClose={() => this.showStatus(false)}
          handleUpdate={this.handleUpdate}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(GeneralInformation);
