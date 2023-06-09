import React, { Component } from "react";
import { Button, Form, Input, message } from "antd";
import {
  createInventoryFamily,
  updateInventoryFamily,
} from "../../../../../Controller/api/inventoryServices";
import { handleError } from "../../../../../Controller/Global";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class GeneralInfoInventoryFamily extends Component {
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
      updateInventoryFamily(this.props.packageData.id, values)
        .then((res) => {
          this.props.setPackage(res.data, 2);
          message.success("Inventory Family updated successfully!");
        })
        .catch((err) => {
          handleError(err);
        })
        .finally(() => {
          this.setState({ buttonLoading: false });
        });
    } else {
      createInventoryFamily(values)
        .then((res) => {
          this.props.setPackage(res.data, 2);
          message.success("Inventory Family created successfully!");
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
      <React.Fragment>
        <div className="row common-form-card-row">
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
                  <div className="row mx-0 info-gray-div align-items-center">
                    <h6 className="mb-0">
                      Please input inventory family name and description.
                    </h6>
                  </div>
                </div>
                <div className="col-12">
                  <Form.Item
                    name="name"
                    label={"Inventory Family Name *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input
                      onBlur={this.handlePackageName}
                      placeholder={"Inventory Family Name"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12">
                  <Form.Item
                    name="description"
                    label={"Description"}
                    rules={[
                      {
                        required: false,
                        //    message: 'this field is required'
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input.TextArea
                      className="text-area-main"
                      onBlur={this.handlePackageName}
                      placeholder={"Description"}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 validate-div-col text-md-right">
                  <Form.Item>
                    <Button htmlType="submit" className="validate-btn-main">
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

export default GeneralInfoInventoryFamily;
