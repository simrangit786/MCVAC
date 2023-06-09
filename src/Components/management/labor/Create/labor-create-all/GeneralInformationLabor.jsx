import React, { Component } from "react";
import { Button, Form, Input, Radio, Menu, message, Select, Spin } from "antd";
import { Image as Images } from "../../../../Images";
import { withRouter } from "react-router-dom";
import {
  getContact,
  updateContact,
} from "../../../../../Controller/api/contactsServices";
import { getRegion } from "../../../../../Controller/api/vehicleServices";
import { handleError } from "../../../../../Controller/Global";
import {
  createLaborGroup,
  updateLaborGroup,
} from "../../../../../Controller/api/labourServices";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class GeneralInformationLabor extends Component {
  state = {
    regions: [],
    buttonLoading: false,
    fetching: false,
  };
  formRef = React.createRef();

  fetchRegion = (params = {}) => {
    this.setState({ fetching: true });
    getRegion(params)
      .then((res) => {
        this.setState({ regions: res.data.results, fetching: false });
      })
      .catch((err) => {
        handleError(err);
        this.setState({ fetching: false });
      });
  };

  handleSubmit = (values) => {
    if (this.props.group) {
      updateLaborGroup(this.props.group.id, values)
        .then((res) => {
          this.props.setGroup(res.data, 1);
          message.success("Labor Group updated successfully!");
          this.setState({ buttonLoading: false });
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      createLaborGroup(values)
        .then((res) => {
          this.props.setGroup(res.data, 1);
          // call popup callback
          this.props.handleAllFilled(res.data);
          message.success("Labor Group created successfully!");
          this.setState({ buttonLoading: false });
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.group !== prevProps.group) {
      this.formRef.current.setFieldsValue({
        ...this.props.group,
        region: this.props.group.region.id,
      });
      this.fetchRegion();
    }
  }

  render() {
    const { fetching, regions, buttonLoading } = this.state;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Please choose a Region and input Labor Group Name.
              </h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              onFinish={this.handleSubmit}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="region"
                    label={"Region *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Select
                      showSearch={true}
                      placeholder="Search and Select Region"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onFocus={() => this.fetchRegion()}
                      onSearch={(e) => this.fetchRegion({ search: e })}
                    >
                      {regions.map((d) => (
                        <Option key={d.id} value={d.id}>
                          {d.title}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="labor_group_name"
                        label={"Labor Group Name *"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                        className="position-relative"
                      >
                        <Input placeholder={"Enter here"} />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <div className="row">
                    <div className="col-12">
                      <Form.Item
                        name="union_type"
                        label={"Type *"}
                        rules={[
                          {
                            required: true,
                            message: "this field is required",
                          },
                        ]}
                        className="position-relative"
                      >
                        <Radio.Group>
                          <Radio style={radioStyle} value={"UNION"}>
                            Union
                          </Radio>
                          <Radio style={radioStyle} value={"NON_UNION"}>
                            Non - Union
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button
                      loading={buttonLoading}
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
      </React.Fragment>
    );
  }
}

export default withRouter(GeneralInformationLabor);
