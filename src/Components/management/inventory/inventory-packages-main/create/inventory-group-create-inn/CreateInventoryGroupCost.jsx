import React, { Component } from "react";
import { Button, Form, InputNumber, Select } from "antd";
import { withRouter } from "react-router-dom";
import { Image as Images } from "../../../../../Images";
import { handleError } from "../../../../../../Controller/Global";
import {
  createInventoryGroup,
  updateInventoryGroup,
  updateInventoryPackageItem,
} from "../../../../../../Controller/api/inventoryServices";

const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateInventoryGroupCost extends Component {
  state = {
    loading: false,
    data: null,
  };
  formRef = React.createRef();

  handleSubmit = (values) => {
    // values.name = this.props.data.name
    // values.inventory_package_item = this.props.data.id

    updateInventoryPackageItem(this.props.data.id, values)
      .then((res) => {
        this.setState({
          data: res.data,
        });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  componentDidMount() {
    if (this.props.data) {
      // this.setState({data: this.props.data.inventory_group})
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
              onFinish={this.handleSubmit}
              ref={this.formRef}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12 small-heading-in-form">
                  <h5>Inventory Group Cost</h5>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
                  <Form.Item
                    name="unit"
                    label={"Unit of Measurement *"}
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
                      placeholder="Select cost type"
                    >
                      <Option value={"UNITS"}>Units</Option>
                      <Option value={"FEET"}>Feet</Option>
                      <Option value={"POUNDS"}>Pounds</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 col-sm-6">
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

export default withRouter(CreateInventoryGroupCost);
