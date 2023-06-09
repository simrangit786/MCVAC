import React, { Component } from "react";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { withRouter } from "react-router-dom";
import { Image as Images } from "../../../../Images";
import { handleError } from "../../../../../Controller/Global";
import { history } from "../../../../../Controller/history";
import { reverse } from "named-urls/dist/index.es";
import { routes } from "../../../../../Controller/Routes";
import {
  createInventoryPackageItem,
  updateInventoryPackageItem,
} from "../../../../../Controller/api/inventoryServices";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class CreateCost extends Component {
  state = {
    loading: false,
  };
  formRef = React.createRef();

  handleSubmit = (values) => {
    values.name = this.props.name;
    values.parent = this.props.subtier;
    if (this.props.data) {
      updateInventoryPackageItem(this.props.data.id, values)
        .then((res) => {
          this.props.setData(res.data);
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      createInventoryPackageItem(values)
        .then((res) => {
          this.props.setData(res.data);
          // history.push(reverse(routes.dashboard.management.inventory.inventory_groups.view, {id: res.data.id}))
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  componentDidMount() {
    if (this.props.data) {
      this.formRef.current.setFieldsValue({
        ...this.props.data,
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="row common-form-card-row mx-0">
          <div className="col-12 p-0">
            <Form
              ref={this.formRef}
              onFinish={this.handleSubmit}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12">
                  <div className="row mx-0 info-gray-div align-items-center">
                    <h6 className="mb-0">Lorem ipsum</h6>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="unit"
                    label={
                      <div className="d-flex align-items-center">
                        <span>Unit of Measurement *</span>
                      </div>
                    }
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
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
                      <Option value={"UNITS"}>Units</Option>
                      <Option value={"FEET"}>Feet</Option>
                      <Option value={"POUNDS"}>Pounds</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="unit_cost"
                    label={"Estimated Unit Cost *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
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
                    name="margin"
                    label={"Margin *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      formatter={(value) => `${value}%`}
                      parser={(value) => value.replace("%", "")}
                      placeholder={"%"}
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

export default withRouter(CreateCost);
