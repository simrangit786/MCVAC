import React, { Component } from "react";
import {
  Button,
  Drawer,
  Dropdown,
  Form,
  Input,
  InputNumber,
  message,
  Select,
} from "antd";
import { handleError } from "../../../../../Controller/Global";
import {
  getSubUnitName,
  sendComData,
  updateComData,
} from "../../../../../Controller/api/disposalServices";
import { Image } from "../../../../Images";
import { updateInventory } from "../../../../../Controller/api/inventoryServices";

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const InputGroup = Input.Group;
const { Option } = Select;
class CreateCustomUnitOfMeasurementDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subUnitNames: [],
      comName: "",
      uomSelect: null,
      factor: null,
      newComId: [],
      abbr: "",
    };
  }
  onChangeCheck = (e) => {
    // console.log(`checked = ${e.target.checked}`);
  };

  componentDidUpdate(prevProps) {
    const { editData } = this.props;
    if (prevProps.editData != this.props.editData) {
      this.setState({
        comName: editData?.name,
        factor: editData?.factor,
        uomSelect: editData?.uom?.id,
        abbr: editData?.abbreviation,
      });
    }
  }

  // componentDidMount() {
  //     this.getSubUnitName()
  // }

  // getSubUnitName = (params = {}) => {
  //     params.unit = 2;
  //     getSubUnitName(params).then(res => {
  //         console.log(res.data, "res.data")
  //         this.setState({subUnitNames: res.data.results})
  //      }).catch(err => {
  //          handleError(err)
  //      })
  // }

  updateData = () => {
    const newArr = this.props?.com;
    let values = {
      com: [...newArr, ...this.state.newComId],
    };

    updateInventory(this.props.inventory.id, values)
      .then((res) => {
        this.props.setInventory(res.data);
        message.success("Inventory updated successfully");
        this.props.onClose();
        this.setState({
          subUnitNames: [],
          comName: "",
          factor: null,
          abbr: "",
          newComId: [],
        });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  sendComData = () => {
    let values = {
      name: this.state.comName,
      factor: this.state.factor,
      uom: this.state.uomSelect || this.props.baseUnitValue,
      abbreviation: this.state.abbr,
    };
    if (this.props.editData) {
      updateComData(this.props.editData.id, values)
        .then((res) => {
          this.setState({ newComId: [] }, () => this.updateData());
          message.success("successfully added!");
        })
        .catch((err) => {
          handleError(err);
        });
    } else {
      sendComData(values)
        .then((res) => {
          this.setState({ newComId: [res.data.id] }, () => this.updateData());
          message.success("successfully added!");
        })
        .catch((err) => {
          handleError(err);
        });
    }
  };

  handleNameChange = (e) => {
    this.setState({ comName: e.target.value });
  };

  handleAbbrChange = (e) => {
    this.setState({ abbr: e.target.value });
  };

  render() {
    const { inventory, selectedUom, baseUnitValue } = this.props;
    return (
      <React.Fragment>
        <Drawer
          className="main-drawer-div main-all-form-modal inline-item-drawer"
          title={
            <div className="d-flex align-items-center">
              {/*<img alt="" className="img-fluid" src={Image.disposal_green_icon}/>*/}
              <span>Custom Unit of Measurement</span>
            </div>
          }
          centered
          width={500}
          closable={true}
          onClose={() => {
            this.props.onClose();
            this.setState({
              subUnitNames: [],
              comName: "",
              factor: null,
              abbr: "",
              newComId: [],
            });
          }}
          placement={"right"}
          visible={this.props.visible}
          footer={
            <div
              style={{
                textAlign: "right",
              }}
            >
              <Button onClick={this.props.onClose}>Cancel</Button>
              <Button onClick={this.sendComData} type="primary">
                {this.props.editData?.id ? "Update" : "Create"}
              </Button>
            </div>
          }
        >
          <div className="row mx-0 unit-measurement-row-drawer pt-0">
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <div className="row mt-4">
                    <div className="col-12">
                      <p>
                        Amet minim mollit non deserunt ullamco est sit aliqua
                        dolor do amet sint.{" "}
                      </p>
                    </div>
                    <div className="col-12">
                      <Form {...layout} className="main-inner-form">
                        <div className="row mx-0">
                          <div className="col-12">
                            <Form.Item
                              label={
                                <div className="d-flex align-items-center">
                                  <span>Custom Unit of Measurement Name *</span>
                                  <img
                                    alt=""
                                    className="img-fluid"
                                    src={Image.info_small}
                                  />
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
                              <Input
                                type="text"
                                placeholder={"MY UOM"}
                                value={this.state.comName}
                                onChange={(e) => this.handleNameChange(e)}
                              />
                            </Form.Item>
                          </div>
                          <div className="col-12">
                            <Form.Item
                              label={
                                <div className="d-flex align-items-center">
                                  <span>Abbreviation *</span>
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
                              <Input
                                type="text"
                                placeholder={"Symbol"}
                                value={this.state.abbr}
                                onChange={(e) => this.handleAbbrChange(e)}
                              />
                            </Form.Item>
                          </div>
                          <div className="col-12">
                            <h5>Conversion</h5>
                          </div>
                          <div className="col-12 col-sm-6">
                            <Form.Item
                              name="types"
                              label={
                                <div className="d-flex align-items-center">
                                  <span>Custom UOM *</span>
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
                              <React.Fragment>
                                <div className="row">
                                  <div className="col-12 position-relative">
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
                                          width: "50%",
                                          borderLeft: "0",
                                          borderRadius: "0 6px 6px 0",
                                        }}
                                        value={this.state.abbr}
                                      />
                                    </InputGroup>
                                    <span className="equal-sign position-absolute">
                                      =
                                    </span>
                                  </div>
                                </div>
                              </React.Fragment>
                            </Form.Item>
                          </div>
                          <div className="col-12 col-sm-6">
                            <Form.Item
                              name="types"
                              label={
                                <div className="d-flex align-items-center">
                                  <span>Universal UOM *</span>
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
                              <React.Fragment>
                                <div className="row">
                                  <div className="col-12">
                                    <InputGroup compact>
                                      <InputNumber
                                        style={{
                                          width: "30%",
                                          borderRight: "0",
                                          borderRadius: "6px 0 0 6px",
                                        }}
                                        onChange={(value) =>
                                          this.setState({ factor: value })
                                        }
                                        value={this.state.factor || null}
                                      />
                                      <Select
                                        className="custom-pound-select"
                                        style={{ width: "70%" }}
                                        suffixIcon={
                                          <img
                                            src={Image.caret_down_small_select}
                                            alt=""
                                            className="img-fluid"
                                          />
                                        }
                                        onChange={(event) =>
                                          this.setState({ uomSelect: event })
                                        }
                                        value={this.state.uomSelect || baseUnitValue}
                                        // defaultValue={inventory.com.length > 0 ? selectedUom.id : null}
                                        disabled
                                      >
                                        {inventory?.uom_array?.map((i) => {
                                          return (
                                            <Option value={i.id}>
                                              {i.name} {`(${i.symbol})`}
                                            </Option>
                                          );
                                        })}
                                      </Select>
                                    </InputGroup>
                                  </div>
                                </div>
                              </React.Fragment>
                            </Form.Item>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default CreateCustomUnitOfMeasurementDrawer;
