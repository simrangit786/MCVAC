import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Select,
} from "antd";
import { Image } from "../../../../../Images";
import { countries } from "../../../../../../Controller/country";
import {
  createInternalLocation,
  updateInternalLocation,
} from "../../../../../../Controller/api/vehicleServices";
import { uniqBy, orderBy } from "lodash";
import { getAccountCounty } from "../../../../../../Controller/api/customerAccountServices";
import { Image as Images } from "../../../../../Images";
import { handleError } from '../../../../../../Controller/Global';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateInternalLocationDrawer extends Component {
  state = {
    county: [],
    updateMainState: null,
  }

  componentDidMount() {
    getAccountCounty({ ordering: 'county' })
      .then(response => {
        this.setState({ county: response.data })
        this.setState({ updateMainState: response.data })
      })
      .catch((err) => {
        handleError(err)
      })

  }
  formRef = React.createRef();

  onSubmit = (values) => {
    if (this.props.editData) {
      const params = {
        ...values,
        type: "FLEET",
        fleet_id: this.props.match.params.id,
      };
      updateInternalLocation(this.props.editData.id, params)
        .then((res) => {
          message.success("Internal Location Updated Successfully");
          if (this.props.callbackContact) {
            this.props.callbackContact(res.data);
          }
          this.formRef.current.resetFields();
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    } else {
      const params = {
        ...values,
        type: "FLEET",
        fleet_id: this.props.match.params.id,
      };
      createInternalLocation(params)
        .then((res) => {
          message.success("Internal Location Created Successfully");
          if (this.props.callbackContact) {
            this.props.callbackContact(res.data);
          }
          this.formRef.current.resetFields();
        })
        .catch((err) => {
          if (err.response) {
            Object.keys(err.response.data).map((e) => {
              message.error(err.response.data[e]);
            });
          }
        });
    }
    this.props.onClose();
  };

  handleCountyChange = (e) => {
    this.formRef.current.setFieldsValue({
      state: null,
    })
    const getState = this.state.county.filter(item => item.county === e)
    this.setState({ updateMainState: getState })
    if (getState?.length === 1) {
      this.formRef.current.setFieldsValue({
        state: getState[0].state
      })
    }
  }

  populateData = () => {
    if (this.props.editData) {
      this.formRef.current.setFieldsValue({
        ...this.props.editData,
      });
    } else {
      if (this.formRef?.current) {
        this.formRef.current.setFieldsValue({
          country: "United States",
        });
      }
    }
  };

  showConfirmModal = (visible) => {
    this.setState({
      visibleConfirm: visible,
    });
  };

  render() {
    const { editData } = this.props;
    let { county, updateMainState } = this.state;

    return (
      <React.Fragment>
        <Drawer
          afterVisibleChange={this.populateData}
          centered
          closable={true}
          destroyOnClose={true}
          title="Create Warehouse"
          visible={this.props.visible}
          onClose={this.props.onClose}
          onOk={this.props.onClose}
          onCancel={this.props.onClose}
          className="main-all-form-modal main-drawer-div drawer-update"
          width={"625px"}
          placement={"right"}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button
                onClick={() => this.props.onClose()}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  this.formRef.current.submit();
                  this.showConfirmModal(true);
                }}
                type="primary"
              >
                {`${this.props.editData ? "Update" : "Create"}`}
              </Button>
            </div>
          }
        >
          <div className="row mx-0 inner-modal-main-row">
            <div className="col-12">
              <Form
                ref={this.formRef}
                onFinish={this.onSubmit}
                {...layout}
                hideRequiredMark={true}
                className="main-inner-form"
              >
                <div className="row mx-0">
                  <div className="col-12">
                    <Form.Item
                      name="name"
                      label={"Location Name"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Input placeholder="Location Name" />
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="street_address"
                      label={"Street Address *"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Input placeholder="Street Address" />
                    </Form.Item>
                  </div>

                  <div className="col-12">
                    <Form.Item
                      name="county"
                      label={"County"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        suffixIcon={
                          <img
                            alt=""
                            src={Images.caret_down_small_select}
                            className="img-fluid"
                          />
                        }
                        onChange={this.handleCountyChange}
                        placeholder="Select"
                      // defaultValue={main?.country ? main?.country : countries.find(i => i.code === "US").name}
                      >

                        {uniqBy(county, "county").map((c) => (

                          <Select.Option key={c.id} value={c.county}>
                            {c.county}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className="col-12">
                    <div className="row">
                      <div className="col-6">
                        <Form.Item
                          name="city"
                          label={"City"}
                          rules={[
                            {
                              required: true,
                              message: "this field is required",
                            },
                          ]}
                        >
                          <Input placeholder="City" />
                        </Form.Item>
                      </div>
                      <div className="col-6">
                        <Form.Item
                          name="state"
                          label={"State/Province *"}
                          rules={[
                            {
                              required: true,
                              message: "this field is required",
                            },
                          ]}
                        >
                          <Select
                            showSearch
                            suffixIcon={
                              <img
                                alt=""
                                src={Images.caret_down_small_select}
                                className="img-fluid"
                              />
                            }

                            placeholder="Select"
                          // defaultValue={main?.country ? main?.country : countries.find(i => i.code === "US").name}
                          >
                            {(uniqBy(orderBy(updateMainState, "state"), 'state')).map((c) => (
                              <Select.Option key={c.id} value={c.state}>
                                {c.state}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <Form.Item
                      name="zip"
                      label={"Zip/Postal Code"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Input placeholder="Zip/Postal Code" />
                    </Form.Item>
                  </div>
                  <div className="col-6">
                    <Form.Item
                      name="country"
                      label={"Country *"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Select
                        showSearch={true}
                        suffixIcon={
                          <img
                            alt=""
                            src={Image.caret_down_small_select}
                            className="img-fluid"
                          />
                        }
                        placeholder="Please select Country"
                      // defaultValue={editData?.country ? editData?.country : 'United States'}
                      >
                        {countries.map((c) => (
                          <Select.Option value={c.name}>{c.name}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className="col-12">
                    <Form.Item
                      name="phone"
                      label={"Phone Number *"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <InputNumber
                        formatter={(value) =>
                          `${value}`
                            .match(/\d*/g)
                            .join("")
                            .match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
                            .slice(1)
                            .join("-")
                            .replace(/-*$/g, "")
                        }
                        parser={(value) => value.replace(/\$\s?|(-*)/g, "")}
                        placeholder="Phone Number"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="email"
                      label={"Email Address *"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Input placeholder="Email Address" />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default withRouter(CreateInternalLocationDrawer);
