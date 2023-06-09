import React, { Component } from "react";
import {
  Button,
  Collapse,
  Drawer,
  Row,
  Col,
  Checkbox,
  Form,
  Input,
  Dropdown,
  Menu,
  message,
  Select,
  Radio,
} from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { Image as Images } from "../../../../Images";

import { formatPhone } from "../../../../../Controller/utils";
import CommonConfirmationModal from "../../../../modals/CommonConfirmationModal";
import { withRouter } from "react-router-dom";
import {
  getSubUnitName,
  getUnitType,
} from "../../../../../Controller/api/disposalServices";
import { handleError } from "../../../../../Controller/Global";
import { updateInventory } from "../../../../../Controller/api/inventoryServices";
import CommonWarningModal from "../../../../modals/CommonWarningModal";

const { Panel } = Collapse;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class CreateUniversalMeasurementDrawer extends Component {
  // state = {
  //     data: null,
  //     buttonLoading: false,
  //     visibleConfirm: false
  // };
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      data: null,
      buttonLoading: false,
      visibleConfirm: false,
      unit_types: [],
      subUnitNames: [],
      selectedCheckboxes: [],
    };
  }

  formRef = React.createRef();

  onChange = (id) => {
    if (!this.state.value) {
      this.setState({ value: id }, () => this.getSubUnitName());
    } else {
      this.showConfirmModal(true);
      this.setState({ newValue: id });
    }
  };

  onCheckChange = (e, id) => {
    let { subUnitNames } = this.state;

    subUnitNames.forEach((subUnit) => {
      if (subUnit.id === id) {
        subUnit.isChecked = e.target.checked;
      }
    });
    let filteredIdArr = subUnitNames
      ?.filter((i) => {
        return i.isChecked == true;
      })
      .map((i) => i.id);

    this.setState({ selectedCheckboxes: filteredIdArr });
  };

  showConfirmModal = (visible) => {
    this.setState({
      visibleConfirm: visible,
      data: null,
    });
  };

  componentDidMount() {
    this.getUnitTypes();
    this.getSubUnitName();
    this.setState({
      value:
        this.props.inventory?.uom_array &&
        this.props.inventory?.uom_array[0] &&
        this.props.inventory?.uom_array[0]?.unit_type?.id,
    });
  }

  getUnitTypes = () => {
    getUnitType()
      .then((res) => {
        //   console.log(res.data, "res.data")
        this.setState({ unit_types: res.data.results });
      })
      .catch((err) => {
        handleError(err);
      });
  };

  getSubUnitName = (params = {}) => {
    const defaultValueId =
      this.props.inventory?.uom_array &&
      this.props.inventory?.uom_array[0] &&
      this.props.inventory?.uom_array[0]?.unit_type?.id;
    const defaultUomArr = this.props.inventory?.uom_array;
    params.unit = this.state.value ? this.state.value : defaultValueId;
    getSubUnitName(params)
      .then((res) => {
        // if(params?.alreadyChecked) {
        this.setState({ subUnitNames: res.data }, () => {
          defaultUomArr &&
            defaultUomArr.forEach((subUnit) => {
              subUnit.isChecked = true;
            });
          let filteredArray = this.state.subUnitNames?.map(
            (obj) => defaultUomArr?.find((o) => o.id === obj.id) || obj
          );
          // console.log(filteredArray, "filteredArray")
          this.setState({ subUnitNames: filteredArray });
        });
        // }
        // else {
        //     this.setState({subUnitNames: res.data.results})
        // }
      })
      .catch((err) => {
        handleError(err);
      });
  };

  handleSubmit = (values = {}) => {
    values.uom_array = this.state.selectedCheckboxes;
    const inventoryId = this.props.match.params.id
      ? this.props.match.params.id
      : this.props.inventory.id;
    updateInventory(inventoryId, values)
      .then((res) => {
        this.props.setInventory(res.data, 3);
        message.success("Inventory updated successfully");
        this.props.onClose();
      })
      .catch((err) => {
        handleError(err);
      });
  };

  render() {
    let selectedUnitType = this.state?.unit_types?.find(
      (i) => i.id === this.state.value
    );
    // let { data, buttonLoading } = this.state;
    const { value } = this.state;
    const radioStyle = {
      display: "block",
      height: "40px",
      lineHeight: "25px",
    };
    return (
      <React.Fragment>
        <Drawer
          className="main-drawer-div main-all-form-modal inline-item-drawer drawer-update"
          title={
            <div className="d-flex align-items-center">
              {/*<img alt="" className="img-fluid" src={Image.disposal_green_icon}/>*/}
              <span>Universal Units of Measurement</span>
            </div>
          }
          centered
          width={1000}
          closable={true}
          onClose={() => {
            this.props.onClose();
            this.setState(
              {
                value:
                  this.props.inventory?.uom_array &&
                  this.props.inventory?.uom_array[0] &&
                  this.props.inventory?.uom_array[0]?.unit_type?.id,
              },
              () => this.getSubUnitName()
            );
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
              <Button type="primary" onClick={() => this.handleSubmit()}>
                Create
              </Button>
            </div>
          }
        >
          <div className="row mx-0 unit-measurement-row-drawer pt-0">
            <div className="col-12">
              <div className="row">
                <div className="col-12 col-sm-6 border-right-1">
                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="row mx-0 info-gray-div align-items-center">
                        <h6 className="mb-0">
                          Please select a type of unit of measurement to select
                          unit(s) of measurements.
                        </h6>
                      </div>
                    </div>
                    <div className="col-12">
                      <Form {...layout} className="main-inner-form">
                        <div className="row mx-0">
                          <div className="col-12">
                            <Form.Item
                              name="types"
                              label={""}
                              rules={[
                                {
                                  required: false,
                                  message: "",
                                },
                              ]}
                              className="position-relative"
                            >
                              {/* <Radio.Group onChange={this.onChange} defaultValue={this.props.inventory?.uom_array &&
                                                            this.props.inventory?.uom_array[0] && this.props.inventory?.uom_array[0]?.unit_type?.id}
                                                             value={value}
                                                             > */}
                              {this.state.unit_types.map((i) => {
                                return (
                                  <Radio
                                    style={radioStyle}
                                    onChange={() => this.onChange(i.id)}
                                    checked={
                                      this.state.value === i.id ? true : false
                                    }
                                    key={i.id}
                                  >
                                    {i.name}
                                    <small>
                                      {i.id == 1
                                        ? " (e.g. pieces)"
                                        : i.id == 2
                                        ? " (e.g. gram, kilogram, pound, etc.)"
                                        : i.id == 3
                                        ? " (e.g. inch, foot, milimeter, etc.)"
                                        : " (e.g. pint, quart, gallon, etc.)"}
                                    </small>
                                  </Radio>
                                );
                              })}
                              {/* </Radio.Group> */}
                            </Form.Item>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
                {this.state.value && (
                  <div className="col-12 col-sm-6">
                    {/* <div className="col-12 mt-4 mt-1">
                                        <p>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
                                            sint. </p>
                                    </div> */}
                    <div className="col-12 mt-4">
                      <div className="row mx-0">
                        <div className="col-12 table-responsive main-table-div position-relative">
                          <div className="row mx-0 custom-table-main-row unit-measurement-table">
                            <div className="col-12">
                              <div className="row custom-table-header">
                                <div className="custom-table-cell-th">
                                  <div className="custom-th-heading">
                                    Selected
                                  </div>
                                </div>
                                <div className="custom-table-cell-th">
                                  <div className="custom-th-heading">
                                    Unit Name
                                  </div>
                                </div>
                                <div className="custom-table-cell-th">
                                  <div className="custom-th-heading">
                                    Unit
                                    <bt />
                                    Symbol
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 custom-table-body p-0 bg-white">
                              <div className="custom-table-row custom-row-heading row mx-0">
                                {selectedUnitType?.name}
                              </div>
                              {this.state?.subUnitNames?.map((i) => {
                                return (
                                  <div
                                    className="custom-table-row custom-table-row-level-2 bg-white row mx-0"
                                    key={i.id}
                                  >
                                    <div className="custom-table-cell-td justify-content-center bg-white">
                                      <Checkbox
                                        checked={i.isChecked}
                                        onChange={(e) =>
                                          this.onCheckChange(e, i.id)
                                        }
                                      />
                                    </div>
                                    <div className="custom-table-cell-td justify-content-center text-center bg-white">
                                      {i.name}
                                    </div>
                                    <div className="custom-table-cell-td justify-content-center text-center bg-white">
                                      {i.symbol}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Drawer>
        <CommonWarningModal
          heading={
            "Are you sure you want to change universal unit of measurements?"
          }
          subHeadingUOM={
            <p className="mb-0" style={{ width: "98%" }}>
              If you continue, this will affect all unit of measurements in this
              inventory item.
            </p>
          }
          // okTitle={"View Facility"}
          uomWarning={true}
          okAction={() => {
            this.showConfirmModal(false);
            this.setState({ value: this.state.newValue }, () =>
              this.getSubUnitName()
            );
          }}
          visible={this.state.visibleConfirm}
          onClose={() => {
            this.showConfirmModal(false);
          }}
        />
      </React.Fragment>
    );
  }
}

export default withRouter(CreateUniversalMeasurementDrawer);
