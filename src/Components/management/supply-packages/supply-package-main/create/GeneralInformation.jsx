import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Form, Input, message } from "antd";
import {
  createServiceFamily,
  updateServiceFamily,
} from "../../../../../Controller/api/lineItemsServices";
import { handleError } from "../../../../../Controller/Global";
import {
  updateSupplyFamily,
  createSupplyFamily,
} from "../../../../../Controller/api/supplyServices";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class GeneralInformation extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      buttonLoading: false,
    };
  }

  setFieldData = (packageData) => {
    this.formRef.current.setFieldsValue({
      name: packageData.name,
      description: packageData.description,
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.packageData &&
      this.props.packageData !== prevProps.packageData
    ) {
      this.setFieldData(this.props.packageData);
    }
  }

  onSubmit = (values) => {
    this.setState({ buttonLoading: true });
    if (this.props.packageData) {
      updateSupplyFamily(this.props.packageData.id, values)
        .then((res) => {
          this.props.setPackage(res.data, 2);
          message.success("Supply family updated successfully!");
        })
        .catch((err) => {
          handleError(err);
        })
        .finally(() => {
          this.setState({ buttonLoading: false });
        });
    } else {
      createSupplyFamily(values)
        .then((res) => {
          this.props.setPackage(res.data, 2);
          message.success("Supply family created successfully!");
        })
        .catch((err) => {
          handleError(err);
        })
        .finally(() => {
          this.setState({ buttonLoading: false });
        });
    }
  };

  render() {
    return (
      <div className="row common-form-card-row">
        <div className="col-12">
          <div className="row info-gray-div align-items-center">
            <h6 className="mb-0">
              Please input supply family name and description.{" "}
            </h6>
          </div>
        </div>
        <div className="col-12 p-0">
          <Form
            onFinish={this.onSubmit}
            ref={this.formRef}
            {...layout}
            hideRequiredMark={true}
            className="main-inner-form"
          >
            <div className="row">
              <div className="col-12">
                <Form.Item
                  name="name"
                  label={"Supply Family Name *"}
                  rules={[
                    {
                      required: true,
                      message: "this field is required",
                    },
                  ]}
                  className="position-relative"
                >
                  <Input placeholder={"Enter Here"} />
                </Form.Item>
              </div>
              <div className="col-12">
                <Form.Item
                  name="description"
                  label={"Description"}
                  rules={[
                    {
                      required: false,
                      message: "",
                    },
                  ]}
                  className="position-relative"
                >
                  <Input placeholder={"Type something"} />
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
    );
  }
}

export default GeneralInformation;
