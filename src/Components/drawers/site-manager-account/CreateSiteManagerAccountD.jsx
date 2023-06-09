import React, { Component } from "react";
import { Button, Collapse, Drawer, Form, Input, message, Select } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import CommonConfirmationModal from "../../modals/CommonConfirmationModal";
import {
  createOwnerAccount,
  getIndustries,
  updateOwnerAccount,
} from "../../../Controller/api/ownerAccountServices";
import { Image as Images } from "../../Images";
import DrawersUnsavedExitModal from "../../modals/DrawersUnsavedExitModal";

const { Panel } = Collapse;
const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
class CreateSiteManagerAccountD extends Component {
  formRef = React.createRef();
  state = {
    visibleConfirm: false,
    page: 1,
    industry: [],
    warningModalVisible: false,
    createdAccount: null,
  };
  showConfirmModal = (visible) => {
    this.setState({
      visibleConfirm: visible,
    });
  };

  componentDidMount() {
    this.getIndustries();
  }

  getIndustries = () => {
    const params = {
      page: this.state.page,
    };
    getIndustries(params).then((res) => {
      if (this.state.page === 1) {
        this.setState({ industry: res.data.results });
      } else {
        this.setState((prevState) => {
          return { industry: [...prevState.industry, ...res.data.results] };
        });
      }
    });
  };

  onSubmit = (values) => {
    this.setState({ buttonLoading: true });
    const newValues = {
      ...values,
      account_source: values.account_source ? values.account_source : null,
    };

    if (this.state.createdAccount) {
      updateOwnerAccount(newValues)
        .then((res) => {
          message.success("Account Created Successfully");
          this.setState({ buttonLoading: false, createdAccount: res.data });
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
      createOwnerAccount(newValues)
        .then((res) => {
          message.success("Account Created Successfully");
          this.setState({
            buttonLoading: false,
            createdAccount: res.data,
            visibleConfirm: true,
          });
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
          this.setState({ buttonLoading: false });
        });
    }
  };

  showWarningModal = (visible) => {
    this.setState({ warningModalVisible: visible });
  };
  render() {
    return (
      <React.Fragment>
        <Drawer
          centered
          destroyOnClose={true}
          title="Create Site Manager Account"
          visible={this.props.visible}
          onClose={() => {
            if (!this.state.createdAccount) {
              this.setState({ warningModalVisible: true });
            }
            // this.props.onClose()
          }}
          onCancel={this.props.onClose}
          className="main-all-form-modal main-drawer-div bg-gray-main drawer-update"
          width={"625px"}
          placement={"right"}
          maskClosable={false}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              {/* <Button
                                onClick={() => this.showWarningModal(true)}
                                style={{marginRight: 8}}>
                                Cancel
                            </Button> */}

              <Button
                className="continue-green"
                disabled={this.state.createdAccount ? false : true}
                onClick={() => {
                  this.setState({ createdAccount: null });
                  this.props.onClose();
                }}
                type="primary"
              >
                Continue
              </Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <div className="row summary-info-inner-row">
                <div className="col-12">
                  <Collapse
                    accordion
                    defaultActiveKey={["1"]}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                  >
                    <Panel
                      header={
                        <div className="col-12">
                          <div className="info-card-heading-row row d-flex align-items-center justify-content-between">
                            <span>General Information *</span>
                            {/* <Button
                                                        className="border-0 shadow-none p-0 bg-transparent text-uppercase">required</Button> */}
                          </div>
                        </div>
                      }
                      key="1"
                    >
                      <div className="row mx-0 inner-modal-main-row">
                        <div className="col-12">
                          <Form
                            ref={this.formRef}
                            {...layout}
                            hideRequiredMark={true}
                            onFinish={this.onSubmit}
                            className="main-inner-form"
                          >
                            <div className="row mx-0">
                              <div className="col-12">
                                <Form.Item
                                  name="name"
                                  label={"Account Name *"}
                                  rules={[
                                    {
                                      required: true,
                                      message: "this field is required",
                                    },
                                  ]}
                                >
                                  <Input placeholder="Enter here" />
                                </Form.Item>
                              </div>
                              <div className="col-12">
                                <Form.Item
                                  initialValue={"SITE_OWNER"}
                                  className="account-type-item"
                                  name="account_type"
                                  label={"Account Type *"}
                                  rules={[
                                    {
                                      required: true,
                                      message: "this field is required",
                                    },
                                  ]}
                                >
                                  <Select
                                    disabled={true}
                                    showArrow={false}
                                    suffixIcon={
                                      <img
                                        alt=""
                                        src={Images.caret_down_small_select}
                                        className="img-fluid"
                                      />
                                    }
                                    placeholder="Select Payment Term"
                                  >
                                    <Option value={"CUSTOMER"}>Billing</Option>
                                    <Option value={"SITE_OWNER"}>
                                      Site Manager
                                    </Option>
                                    <Option value={"CUSTOMER_OWNER"}>
                                      Billing, Site Manager
                                    </Option>
                                  </Select>
                                </Form.Item>
                              </div>
                              <div className="col-12">
                                <Form.Item
                                  name="industry"
                                  label={"Industry"}
                                  rules={[
                                    {
                                      required: false,
                                      message: "",
                                    },
                                  ]}
                                  className="position-relative remove-padding-placeholder"
                                >
                                  <Select
                                    // labelInValue
                                    suffixIcon={
                                      <img
                                        alt=""
                                        src={Images.caret_down_small_select}
                                        className="img-fluid"
                                      />
                                    }
                                    placeholder="Select"
                                    onPopupScroll={(e) => {
                                      e.persist();
                                      let target = e.target;
                                      if (
                                        target.scrollTop +
                                          target.offsetHeight ===
                                          target.scrollHeight &&
                                        this.state.page < 3
                                      ) {
                                        this.setState(
                                          { page: this.state.page + 1 },
                                          () => this.getIndustries()
                                        );
                                      }
                                    }}
                                  >
                                    {" "}
                                    {this.state.industry.map((i) => {
                                      return (
                                        <Option value={i.id}>{i.title}</Option>
                                      );
                                    })}
                                  </Select>
                                </Form.Item>
                              </div>
                              <div className="col-12">
                                <Form.Item
                                  name="website"
                                  label={"Website"}
                                  rules={[
                                    {
                                      required: false,
                                      message: " ",
                                    },
                                  ]}
                                >
                                  <Input placeholder="Website" />
                                </Form.Item>
                              </div>
                              <div className="col-12">
                                <Form.Item
                                  name="account_source"
                                  label={"Account Source"}
                                  rules={[
                                    {
                                      required: false,
                                      message: "",
                                    },
                                  ]}
                                  className="position-relative remove-padding-placeholder account-source-div"
                                >
                                  <Select
                                    // labelInValue
                                    suffixIcon={
                                      <img
                                        alt=""
                                        src={Images.caret_down_small_select}
                                        className="img-fluid"
                                      />
                                    }
                                    placeholder="Select"
                                  >
                                    <Option value={"ADVERTISEMENT"}>
                                      Advertisement
                                    </Option>
                                    <Option value={"CONSTRUCTCONNECT"}>
                                      ConstructConnect
                                    </Option>
                                    <Option value={"WORD_OF_MOUTH"}>
                                      Word of Mouth
                                    </Option>
                                    <Option value={"MARKETING_ASSISTANT"}>
                                      Marketing Assistant
                                    </Option>
                                  </Select>
                                </Form.Item>
                              </div>
                              <div className="col-12 validate-div-col text-md-right">
                                <Form.Item>
                                  <Button
                                    loading={this.state.buttonLoading}
                                    htmlType="submit"
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
                    </Panel>
                  </Collapse>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
        <CommonConfirmationModal
          heading={"You’ve successfully added all of the required information."}
          // subHeading={<p className="mb-0">To view this Contact, select  Site Manager Account</p>}
          okTitle={"Continue"}
          okAction={() => {
            this.showConfirmModal(false);
            this.setState({ createdAccount: null });
            this.props.callback(this.state.createdAccount);
            // this.props.onClose()
          }}
          visible={this.state.visibleConfirm}
          // onClose={() => {
          //     this.showConfirmModal(false);
          //     this.props.onClose()
          // }}
        />

        {/* <CommonWarningModal
                    heading={'Are you sure you want to exit creating this Site Manager Account?'}
                    visible={this.state.warningModalVisible}
                    onClose={() => {
                        this.showWarningModal(false);
                        // this.props.callback(this.state.createdAccount)
                    }}/> */}

        <DrawersUnsavedExitModal
          visible={this.state.warningModalVisible}
          title="You haven't added all of the required information."
          cancelText="Continue"
          okText="Exit"
          onOK={() => {
            this.setState({ warningModalVisible: false });
            this.props.onClose();
          }}
          onCancel={() => {
            this.setState({ warningModalVisible: false });
          }}
        />
      </React.Fragment>
    );
  }
}

export default CreateSiteManagerAccountD;
