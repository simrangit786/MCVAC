import React, { Component } from "react";
import { Button, Form, Input, message, Select, Spin } from "antd";
import { withRouter } from "react-router-dom";
import { Image as Images } from "../../../../Images";
import {
  createSupply,
  getSupplyGroup,
  updateSupply,
} from "../../../../../Controller/api/supplyServices";
import { handleError } from "../../../../../Controller/Global";
import CustomSelectOption from "../../../../CustomSelectOption";
import { SUPPLY_GROUP } from "../../../../../Controller/utils";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class GeneralInformationSupplyTools extends Component {
  state = {
    groups: [],
  };

  formRef = React.createRef();

  fetchGroups = (params = {}) => {
    this.setState({ fetching: true });
    params["tier_type"] = SUPPLY_GROUP;
    getSupplyGroup(params)
      .then((res) => {
        this.setState({
          groups: res.data.results
            .filter((p) => p.children.length === 0)
            .map((d) => delete d.children && d),
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

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.supply !== this.props.supply) {
      await this.fetchGroups();
      this.formRef.current.setFieldsValue({
        ...this.props.supply,
        supply_group: {
          key: this.props.supply.supply_group.id,
          value: this.props.supply.supply_group.name,
        },
      });
    }
  }

  handleSubmit = (values) => {
    values.supply_group = values.supply_group.key;
    if (this.props.supply) {
      updateSupply(this.props.supply.id, values)
        .then((res) => {
          this.props.setSupply(res.data, 2);
          message.success("Supply/Small Tools updated successfully!");
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      createSupply(values)
        .then((res) => {
          this.props.setSupply(res.data, 2);
          message.success("Supply/Small Tools created successfully!");
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  render() {
    const { fetching, groups } = this.state;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
          <div className="col-12">
            <div className="row info-gray-div align-items-center">
              <h6 className="mb-0">
                Please input supply name and choose a supply group.{" "}
              </h6>
            </div>
          </div>
          <div className="col-12 p-0">
            <Form
              onFinish={this.handleSubmit}
              ref={this.formRef}
              {...layout}
              hideRequiredMark={true}
              className="main-inner-form"
            >
              <div className="row">
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="name"
                    label={"Supply Name *"}
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
                        "Enter a nickname to distinguish the inventory item"
                      }
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-sm-6">
                  <Form.Item
                    name="supply_group"
                    label={
                      <div className="d-flex align-items-center">
                        <span>Supply Group *</span>
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
                      labelInValue
                      placeholder="Search Supply Groups"
                      showSearch={true}
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      onFocus={() => this.fetchGroups()}
                      onSearch={(e) => this.fetchGroups({ search: e })}
                      onChange={this.handleSelect}
                    >
                      {groups.map((d, index) => (
                        <Option key={index} label={d.name} value={d.id}>
                          <CustomSelectOption
                            data={d}
                            img={d.parent && Images.supply_sub_tier_icon}
                            type={d.parent && "Supply Group"}
                          />
                        </Option>
                      ))}
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

export default withRouter(GeneralInformationSupplyTools);
