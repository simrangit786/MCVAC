import React, { Component } from "react";
import { Button, Form, Input, message, Select, Spin } from "antd";
import { withRouter } from "react-router-dom";
import { handleError } from "../../../../../Controller/Global";
import {
  createInventory,
  getInventoryPackageItem,
  updateInventory,
} from "../../../../../Controller/api/inventoryServices";
import { Image as Images } from "../../../../Images";
import CustomSelectOption from "../../../../CustomSelectOption";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;

class CreateGeneralInfoInventoryItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      fetching: false,
    };
  }
  formRef = React.createRef();

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.inventory !== this.props.inventory) {
      this.formRef.current.setFieldsValue({
        ...this.props.inventory,
        parent: this.props?.inventory?.parent.name,
        // inventory_package_item: this.props.inventory.inventory_package_item.id
      });
    }
  }

  fetchGroups = (params = {}) => {
    this.setState({ fetching: true });
    let newArr = [];
    getInventoryPackageItem({ ...params, not_group: true })
      .then((res) => {
        if (this.props.inventory != null) {
          newArr = res.data.results.filter((i) => {
            return i.id != this.props.inventory.id;
          });
          this.setState({ groups: newArr, fetching: false });
        } else {
          this.setState({ groups: res.data.results, fetching: false });
        }
        // , () => {
        // if (this.props.inventory)
        //     this.formRef.current.setFieldsValue({
        //         unit: this.state.groups.find(i => i.id === this.props.inventory.inventory_package_item.id) ? this.state.groups.find(i => i.id === this.props.inventory.inventory_package_item.id).unit : "-"
        //     })
        // })
      })
      .catch((err) => {
        handleError(err);
        this.setState({ fetching: false });
      });
  };

  handleSubmit = (values) => {
    if (this.props.inventory) {
      if (typeof values.parent === "string") {
        values.parent = this.props.inventory.parent.id;
      }
      updateInventory(this.props.inventory.id, values)
        .then((res) => {
          this.props.setInventory(res.data, 2);
          message.success("Inventory updated successfully");
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      values.tier_type = "INVENTORY_ITEM";
      createInventory(values)
        .then((res) => {
          this.props.setInventory(res.data, 2);
          message.success("Inventory created successfully");
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  render() {
    const { fetching, groups } = this.state;
    const { subtier, onChange } = this.props;
    return (
      <React.Fragment>
        <div className="row common-form-card-row">
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
                    name="name"
                    label={"Inventory Item Name *"}
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
                    name="parent"
                    label={"Inventory Family / Tier *"}
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
                      placeholder="Search Inventory Family / Tier"
                      notFoundContent={fetching ? <Spin size="small" /> : null}
                      filterOption={false}
                      dropdownClassName="custom-select-drop-main"
                      value={subtier}
                      onFocus={() => this.fetchGroups()}
                      onSearch={(e) => this.fetchGroups({ search: e })}
                      onChange={(v) => {
                        onChange("subtier", v);
                        // this.formRef.current.setFieldsValue({
                        //     unit: groups.find(i => i.id === v).unit
                        // })
                      }}
                      optionLabelProp={"label"}
                    >
                      {this.state.groups.map((d, index) => (
                        <Option key={index} label={d.name} value={d.id}>
                          <CustomSelectOption
                            style={{ width: "28px" }}
                            data={d}
                            img={
                              d.tier_type ? null : Images.inventory_item_icon
                            }
                            type={
                              d.tier_type
                                ? "Inventory Tier"
                                : "Inventory Family"
                            }
                          />
                        </Option>
                      ))}
                      {/* {groups.map(d => (
                                                <Option key={d.id}
                                                    value={d.id}>{d.name}</Option>
                                            ))} */}
                    </Select>
                  </Form.Item>
                  {/*<Button className="search-icon bg-transparent border-0 p-0 position-absolute">*/}
                  {/*    <img src={Images.search_small_icon} alt='' className="img-fluid"/>*/}
                  {/*</Button>*/}
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

export default withRouter(CreateGeneralInfoInventoryItems);
