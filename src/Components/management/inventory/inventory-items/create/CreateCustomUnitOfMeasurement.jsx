import React, { Component } from "react";
import { Button, Dropdown, Form, Input, Menu, message, Select } from "antd";
import { Image as Images } from "../../../../Images";
import { withRouter } from "react-router-dom";
import CreateCustomUnitOfMeasurementDrawer from "./CreateCustomUnitOfMeasurementDrawer";
import { handleError } from "../../../../../Controller/Global";
import { deleteComData } from "../../../../../Controller/api/disposalServices";
import measuring_tape_gray_black from "../../../../../assets/images/disposal/Measuring-tape-black.svg";

const InputGroup = Input.Group;
const { Option } = Select;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateCustomUnitOfMeasurement extends Component {
  state = {
    visible: false,
    com: [],
    editData: null,
    baseUnitValue: null
  };

  static getDerivedStateFromProps(props, state) {
    return { com: props?.inventory?.com ||[]};
  }

  showCustomUnitCreate = (visible, item) => {
    this.setState({
      visible: visible,
      editData: item,
    });
  };

  menu = (item) => (
    <Menu>
      <Menu.Item key="0">
        <Button
          className="w-100 p-0 text-left bg-transparent border-0 shadow-none"
          onClick={() => this.showCustomUnitCreate(true, item)}
        >
          Edit
        </Button>
      </Menu.Item>
      <Menu.Item key="1">
        <Button
          className="w-100 p-0 text-left bg-transparent border-0 shadow-none"
          onClick={() => this.handleDelete(item.id)}
        >
          Remove
        </Button>
      </Menu.Item>
    </Menu>
  );

  handleDelete = (id) => {
    // const com = this.state.com.drawer(i => i.id !== id);
    deleteComData(id)
      .then((res) => {
        message.success("Successfully deleted");
        this.props.getInventoryItem();
        // this.setState({com})
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleSubmit = () => {
    this.props.setInventory(this.props.inventory, 4);
    message.success("Inventory updated successfully!");
  };

  handleSelectChange = (value) => {
    this.setState({ baseUnitValue: value });
  };

  render() {
    let { visible, baseUnitValue } = this.state;
    const {inventory} = this.props;
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
                <div className="col-12">
                  <div className="row mx-0 info-gray-div align-items-center">
                    <h6 className="mb-0">
                    Please select Universal Units of Measurement to add Custom Units of Measurement.
                    </h6>
                  </div>
                </div>
                <div className="col-12">
                  <Form.Item
                    name="base_unit"
                    label={"Base Unit of Measurement *"}
                    rules={[
                      {
                        required: true,
                        message: "Please select Custom UOM",
                      },
                    ]}
                  >
                    <Select
                      // labelInValue
                      suffixIcon={
                        <img
                          alt=""
                          src={Images.caret_down_small_select}
                          className="img-fluid"
                        />
                      }
                      placeholder="Select Option"
                      disabled={!inventory?.uom_array}
                      value={baseUnitValue}
                      onChange={this.handleSelectChange}
                    >
                      {this.props.inventory?.uom_array?.map((i) => {
                       return (
                          <Select.Option
                            key={i.id}
                            value={i.id}
                          >{`${i.name} (${i.symbol})`}</Select.Option>
                          )
                        })}
                    </Select>
                  </Form.Item>
                  <small class="small-text-tag">You are choosing a unit of measurement from your pre-selected universal units of measurement.</small>
                </div>
                {this.state.com.length == 0 ? (
                  <div className="col-12 mt-3">
                    <div
                      onClick={() => {
                        if (baseUnitValue) {
                          this.showCustomUnitCreate(true);
                        }
                      }}
                      className="row mx-0 cursor-pointer common-card-upload pointer-no-card"
                    >
                      <div className="col-12 text-center">
                        <img
                          src={Images.measuring_tape_gray_new}
                          alt={""}
                          className="img-fluid"
                        />
                        <h6 className="mb-0"
                         style={{
                          color: baseUnitValue ? "#38BC94" : "#4F4F4F",
                        }}>
                          Create Custom Units of Measurement
                        </h6>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-12">
                    <div className="row measurement-row-details">
                      <div className="col-12 margin-tb-30">
                        <Button
                          onClick={() => this.showCustomUnitCreate(true)}
                          className="edit-create-btn text-uppercase"
                          disabled={!baseUnitValue}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {this.state.com.length > 0 && (
                  <div className="col-12">
                  <div className="row">
                    <div className="col-12 my-3">
                      <div className="row">
                        <div className="col-12 custom-uom-table custom-uom-table-2">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>custom uom name</th>
                                <th>abbreviation</th>
                                <th>conversion</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.com?.map((i) => {
                                return (
                                  <tr>
                                    <td>{i.name || "-"}</td>
                                    <td>{i.abbreviation || "-"}</td>
                                    <td>
                                      <div className="w-100 d-flex align-items-center justify-content-between">
                                        <span>
                                          1{i.abbreviation} = {i.factor || 1}
                                          {i.uom.symbol || "-"}
                                        </span>
                                        <Dropdown
                                          overlayClassName="add-remove-dropdown-main"
                                          overlay={() => this.menu(i)}
                                          trigger={["click"]}
                                        >
                                          <a
                                            className="ant-dropdown-link more-btn-tag position-absolute"
                                            onClick={(e) => e.preventDefault()}
                                          >
                                            <img
                                              src={Images.more_black}
                                              alt=""
                                              className="img-fluid"
                                            />
                                          </a>
                                        </Dropdown>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )
                  //   :(
                  //       <div className="col-12">
                  //   <div
                  //     onClick={() => this.showUniversalType(true)}
                  //     className="row mx-0 common-card-upload cursor-pointer pointer-no-card"
                  //   >
                  //     <div className="col-12 text-center">
                  //       <img
                  //         src={Images.measuring_tape_gray_new}
                  //         alt={""}
                  //         className="img-fluid"
                  //       />
                  //       <h6 className="mb-0 color-gray-3">
                  //         Create Custom Units of Measurement
                  //       </h6>
                  //     </div>
                  //   </div>
                  // </div>
                  //   )
                }
                {/*{this.state.com?.map((i) => {
                  return (
                    <>
                      <div className="col-12" key={i.id}>
                        <div className="row mx-0 measurement-unit-card">
                          <div className="unit-card-head">
                            <h6 className="mb-0 text-uppercase">
                              <img
                                src={Images.measuring_tape_black}
                                alt=""
                                className="img-fluid"
                              />
                              <span>{i.name}</span>
                            </h6>
                          </div>
                          <div className="unit-card-details position-relative">
                            <div className="row">
                              <div className="col-12">
                                <h6>Conversion</h6>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12 col-sm-6 position-relative">
                                <InputGroup compact>
                                  <Input
                                    disabled={true}
                                    style={{
                                      width: "40%",
                                      borderRight: "0",
                                      borderRadius: "6px 0 0 6px",
                                    }}
                                    defaultValue="1"
                                  />
                                  <Input
                                    disabled={true}
                                    style={{
                                      width: "40%",
                                      borderLeft: "0",
                                      borderRadius: "0 6px 6px 0",
                                    }}
                                    value={i.abbreviation}
                                  />
                                </InputGroup>
                                <span className="equal-sign position-absolute">
                                  =
                                </span>
                              </div>
                              <div className="col-12 col-sm-6">
                                <InputGroup compact>
                                  <Input
                                    disabled={true}
                                    style={{
                                      width: "45%",
                                      borderRight: "0",
                                      borderRadius: "6px 0 0 6px",
                                    }}
                                    value={i.factor}
                                  />
                                  <Select
                                    className="custom-pound-select"
                                    disabled={true}
                                    style={{ width: "45%" }}
                                    suffixIcon={
                                      <img
                                        src={Images.caret_down_small_select}
                                        alt=""
                                        className="img-fluid"
                                      />
                                    }
                                    defaultValue="a"
                                  >
                                    <Option value="a">{i.uom.symbol}</Option>
                                  </Select>
                                </InputGroup>
                                <Dropdown
                                  overlayClassName="add-remove-dropdown-main"
                                  overlay={() => this.menu(i)}
                                  trigger={["click"]}
                                >
                                  <a
                                    className="ant-dropdown-link more-btn-tag position-absolute"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    <img
                                      src={Images.more_black}
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </a>
                                </Dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                )}*/}

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
        <CreateCustomUnitOfMeasurementDrawer
          callbackFacility={this.callbackFacility}
          visible={visible}
          com={this.state.com?.map((i) => i.id)}
          inventory={this.props.inventory}
          editData={this.state.editData}
          selectedUom={
            this.state.com.length > 0 ? this.state.com[0]?.uom : null
          }
          baseUnitValue={baseUnitValue}
          setInventory={this.props.setInventory}
          onClose={(data) => {
            this.showCustomUnitCreate(false);
            if (data) {
              this.props.getInventoryItem();
            }
          }}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(CreateCustomUnitOfMeasurement);
