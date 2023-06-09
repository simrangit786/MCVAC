import React, { Component } from "react";
import { Button, Form, Input, message, Select } from "antd";
import { withRouter } from "react-router-dom";
import { Image as Images } from "../../../../Images";
import {
  createInventoryKit,
  updateInventoryKit,
} from "../../../../../Controller/api/inventoryServices";
import { handleError } from "../../../../../Controller/Global";
import { getSubUnitName } from "../../../../../Controller/api/disposalServices";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option, OptGroup } = Select;

class GeneralInformationInevntoryKits extends Component {
  formRef = React.createRef();

  state = {
    UnitTypes: {},
  };

  componentDidMount() {
    getSubUnitName()
      .then((res) => {
        const UnitTypes = {};
        res.data.forEach((item) => {
          if (!UnitTypes[item.unit_type.name]) {
            UnitTypes[item.unit_type.name] = [];
          }
          UnitTypes[item.unit_type.name].push(item);
        });
        this.setState({ UnitTypes });
      })
      .catch((err) => {
        message.error(err);
      });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.kit !== prevProps.kit) {
      this.formRef.current.setFieldsValue({
        ...this.props.kit,
        unit: {
          value: this.props.kit?.unit?.id,
          label: this.props.kit?.unit?.name,
        },
      });
    }
  }

  handleSubmit = (values) => {
    if (this.props.kit) {
      updateInventoryKit(this.props.kit.id, {
        ...values,
        unit: values.unit.value,
      })
        .then((res) => {
          this.props.setKit(res.data, 2);
          message.success("Inventory Kit updated Successfully");
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      createInventoryKit({ ...values, unit: values.unit.value })
        .then((res) => {
          this.props.setKit(res.data, 2);
          message.success("Inventory Kit created Successfully");
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  render() {
    const {UnitTypes} = this.state;
    // console.log(UnitTypes)
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12 p-0">
            <Form
              {...layout}
              ref={this.formRef}
              onFinish={this.handleSubmit}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12">
                  <div className="row mx-0 info-gray-div align-items-center">
                    <h6 className="mb-0">
                      Please input inventory kit name and choose unit of
                      measurement.
                    </h6>
                  </div>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="name"
                    label={"Inventory Kit Name *"}
                    rules={[
                      {
                        required: true,
                        message: "this field is required",
                      },
                    ]}
                    className="position-relative"
                  >
                    <Input
                      placeholder={
                        "Enter a nickname to distinguish the inventory kit"
                      }
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="unit"
                    label={
                      <div className="d-flex align-items-center kit-uom">
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
                      labelInValue
                    >
                      {Object.entries(UnitTypes).map((ut, index, arr) => {
                        return (
                          <OptGroup
                            key={ut && ut[0] && ut[0]}
                            value={ut && ut[0] && ut[0]}
                            label={ut && ut[0] && ut[0]}
                            className={"kit-uom-optgroup"}
                          >
                            {ut &&
                              ut[1] &&
                              ut[1].map((u) => {
                                return (
                                  <Option
                                    key={u.id}
                                    value={u.id}
                                    className="text-lowercase"
                                  >
                                    {u.name}
                                  </Option>
                                );
                              })}
                          </OptGroup>
                        );
                      })}
                    </Select>
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

export default withRouter(GeneralInformationInevntoryKits);
