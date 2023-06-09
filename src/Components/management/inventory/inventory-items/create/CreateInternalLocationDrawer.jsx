import React, { Component } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import { Image as Images } from "../../../../Images";
import CommonConfirmationModal from "../../../../modals/CommonConfirmationModal";
import { withRouter } from "react-router-dom";
import { countries } from "../../../../../Controller/country";
import {
  updateInternalLocation,
  createInternalLocation,
} from "../../../../../Controller/api/labourServices";
import { uniqBy, orderBy } from "lodash";
import { getAccountCounty } from '../../../../../Controller/api/customerAccountServices';
import { handleError } from '../../../../../Controller/Global';
const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateInternalLocationDrawer extends Component {
  state = {
    data: null,
    buttonLoading: false,
    visibleConfirm: false,
    county: [],
    updateMainState: null,
  };
  formRef = React.createRef();

  showConfirmModal = (visible) => {
    this.setState({
      visibleConfirm: visible,
    });
    this.setState({ data: null });
  };

  onSubmit = (values) => {
    if (this.props.editData) {
      const params = {
        ...values,
        type: "INVENTORY",
        inventory_id: this.props.match.params.id,
      };
      updateInternalLocation(this.props.editData.id, params)
        .then((res) => {
          message.success("Internal Location Updated Successfully");
          this.formRef.current.resetFields();
          if (this.props.editData) {
            this.props.callbackContact(res.data);
          }
          this.props.onClose()
        })
        .catch((err) => {
         handleError(err)
        });
    } else {
      const params = {
        ...values,
        type: "INVENTORY",
        // inventory_id: this.props.match.params.id
      };
      createInternalLocation(params)
        .then((res) => {
          message.success("Internal Location Created Successfully");
          // if(this.props.callbackContact){
          this.props.callbackContact(res.data, true);
          // }
          // this.formRef.current.resetFields();
          // this.showConfirmModal(true)
          this.props.onClose()

        })
        .catch((err) => {
          handleError(err)
        });
    }
    // this.props.onClose();
  };

  // menu = (item, type) => (
  //     <Menu>
  //         <Menu.Item key="0">
  //             <Button onClick={() => this.handleRemove(item, type)}
  //                 className="border-0 p-0 shadow-none bg-transparent">Remove</Button>
  //         </Menu.Item>
  //         <Menu.Item key="1">
  //             <Button onClick={() => this.handleEdit(item, type)}
  //                 className="border-0 p-0 shadow-none bg-transparent">Edit</Button>
  //         </Menu.Item>
  //     </Menu>
  // );

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

  componentDidMount() {
    getAccountCounty({ ordering: 'county' })
      .then(response => {
        this.setState({ county: response.data })
        this.setState({ updateMainState: response.data })
      })
      .catch((err) => {
        handleError(err)
        this.setState({ load: false })
      })
  }


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
          title={editData ? "Edit Warehouse" : "Create Warehouse"}
          visible={this.props.visible}
          onClose={this.props.onClose}
          onOk={this.props.onClose}
          onCancel={this.props.onClose}
          className="main-all-form-modal main-drawer-div internal-location drawer-update"
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
                onFinish={this.onSubmit}
                ref={this.formRef}
                {...layout}
                className="main-inner-form"
              >
                <div className="row">
                  <div className="col-12">
                    <Form.Item
                      name="name"
                      label={
                        <div className="d-flex align-items-center">
                          <span className="mr-1">Location Name *</span>
                          {/* <img
                            src={Images.info_small}
                            alt=""
                            className="img-fluid"
                          /> */}
                        </div>
                      }
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Input placeholder={"Location Name"} />
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      name="epa_id"
                      label={"EPA ID"}
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                    >
                      <Input
                        placeholder="ABC123456789"
                      />
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
                      <Input placeholder={"Street Address"} />
                    </Form.Item>
                  </div>
                  {/* <div className="col-12">
                                        <Form.Item
                                            name="street_address_2"
                                            label={'Street Address *'}
                                            rules={[{
                                                required: true,
                                                message: 'this field is required'
                                            }]}>
                                            <Input placeholder={'Street Address'}/>
                                        </Form.Item>
                                    </div> */}

                  <div className="col-12">
                    {/* <Form.Item
                      name="county"
                      label={"County"}
                      rules={[
                        {
                          required: false,
                          message: "",
                        },
                      ]}
                    >
                      <Input placeholder="County" />
                    </Form.Item> */}
                    <Form.Item
                      name="county"
                      label={"County"}
                      rules={[
                        {
                          required: false,
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

                  <div className="col-12 col-sm-6">
                    <Form.Item
                      name="city"
                      label={"City *"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Input placeholder={"City"} />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-sm-6">
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
                  <div className="col-12 col-sm-6">
                    <Form.Item
                      name="zip"
                      label={"ZIP/Postal Code *"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <Input placeholder={"ZIP/Postal Code"} />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-sm-6">
                    <Form.Item
                      name="country"
                      label={"Country *"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                      className="position-relative"
                    >
                      <Select
                        placeholder="Select Country"
                        suffixIcon={
                          <img
                            alt=""
                            src={Images.caret_down_small_select}
                            className="img-fluid"
                          />
                        }
                      // defaultValue={editData?.country ? editData?.country : 'United States'}
                      >
                        {countries.map((c) => {
                          return <Option value={c.name}>{c.name}</Option>;
                        })}
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
                        maxLength={12}
                        parser={(value) => value.replace(/\$\s?|(-*)/g, "")}
                        placeholder={"123-456-7890"}
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
                      <Input type={"email"} placeholder={"Email Address"} />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Drawer>
        <CommonConfirmationModal
          heading={"You’ve successfully created this Warehouses!"}
          subHeading={
            <p className="mb-0">
              To view this Warehouses, select View Facility
            </p>
          }
          okTitle={"View Warehouses"}
          okAction={() => {
            this.showConfirmModal(false);
            this.props.onClose();
          }}
          visible={this.state.visibleConfirm}
          onClose={() => {
            this.showConfirmModal(false);
            this.props.onClose();
          }}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(CreateInternalLocationDrawer);
