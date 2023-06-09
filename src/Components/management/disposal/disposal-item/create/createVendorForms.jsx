import { Button, Dropdown, Form, Input, InputNumber, Menu, Select } from "antd";
import React, {Component} from "react";
import { withRouter } from "react-router-dom";
import { createDisposalVendor, deleteDisposalVendorPrice, updateDisposalVendorPrice } from "../../../../../Controller/api/disposalServices";
import { handleError } from "../../../../../Controller/Global";
import { calculatePercentage, formatPhone } from "../../../../../Controller/utils";
import {Image as Images} from "../../../../Images";

class createVendorForms extends Component {

    state = {
        edited: false,
        tableData: "",
    }

    priceMenu = (item) => (
      <Menu>
          <Menu.Item key="0">
              <Button
                  className="w-100 p-0 text-left bg-transparent border-0 shadow-none"
                  onClick={() => this.handleEditPrice(item)}
              >
                  Edit
              </Button>
          </Menu.Item>
          <Menu.Item key="1">
              <Button
                  className="w-100 p-0 text-left bg-transparent border-0 shadow-none"
                  onClick={() => this.handleDeletePrice(item.id)}
              >
                  Remove
              </Button>
          </Menu.Item>
      </Menu>
  );

    handleDeletePrice = (id) => {
        deleteDisposalVendorPrice(id).then((res) => {
            this.props.getDisposalVendor()
        })
    }

    handleEditPrice = (data) => {
      this.setState({edited: true, tableData: data})
        this.formRef.current.setFieldsValue({
          margin: `${parseInt(data.margin).toFixed(2)}%`,
            unit_cost: data.unit_cost,
            unit_type: data.unit_type === "UOM" ? data.vendor_uom?.id : `COM_${data.vendor_com?.id}`
        })
        const unitPrice = calculatePercentage(data.unit_cost,data.margin)
        this.formRef.current.setFieldsValue({
          unit_price: unitPrice
        })
    }

    handleAddVendor = (val) => {
        if (this.state.edited) {
            const editedData = {
                ...val,
                margin: val.margin.split(".")[0]
            }
            if (isNaN(parseInt(val.unit_type))) {
                editedData['unit_type'] = "COM"
                editedData['vendor_com'] = val.unit_type.split("_")[1]

            } else {
                editedData['unit_type'] = "UOM"
                editedData['vendor_uom'] = val.unit_type
            }
            updateDisposalVendorPrice(this.state.tableData.id, editedData).then((res => {
                this.props.getDisposalVendor()
                this.formRef.current.setFieldsValue({
                  margin: "",
                  unit_cost: "",
                  unit_type: null,
                  unit_price:""
              })
            })).catch(err => {
                handleError(err)
            })
            this.setState({edited: false})
        } else {
        const Id = this.props.disposal.id;
        const data = {
            disposal: Id,
            single_vendor_id: this.props.vendorData.id,
            price_data: {
                "unit_cost": val.unit_cost,
                "margin": val.margin?.split("%")[0],
            }
        }
        if (isNaN(parseInt(val.unit_type))) {
            data['price_data']['unit_type'] = "COM"
            data['price_data']['com'] = val.unit_type.split("_")[1]

        } else {
            data['price_data']['unit_type'] = "UOM"
            data['price_data']['uom'] = val.unit_type
        }
       createDisposalVendor(data).then((res) => {
           this.props.getDisposalVendor()
           this.formRef.current.setFieldsValue({
            margin: "",
            unit_cost: "",
            unit_type: null,
            unit_price:""
        })


       }).catch((err) => {
           handleError(err)
       })
    }
    }

    onBlurMarginValue = (e) => {
      if(e.target.value) {
      this.formRef.current.setFieldsValue({margin: `${parseInt(e.target.value).toFixed(2)}%`})
      }
  }

  onFocusMarginValue = (e) => {
      this.formRef.current.setFieldsValue({margin: e.target.value.replace("%", "")})
  }

    onValuesChange = (changedValues, allValues) => {
        const total = calculatePercentage(
            allValues.unit_cost,
            allValues.margin
        )

        this.formRef.current.setFieldsValue({
            unit_price: total,
        })

    }

    formRef = React.createRef();
    render() {
        const { vendorData, index } = this.props;

        return (
            <Form
              ref = {this.formRef}
              layout={'vertical'}
              onFinish = {this.handleAddVendor}
              onValuesChange={this.onValuesChange}
              hideRequiredMark={true}
              className="main-inner-form"
            >
            <div
            className="col-12 location-row-main border-0 mb-0"
            key={vendorData.vendor?.id}
          >
            <div className="row mx-0">
              <div className="col-12">
                {/*<div className="row">*/}
                {/*    <div className="col-12 p-0">*/}
                {/*        <h6 className="mb-0">Location {index + 1}</h6>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="row site-details-row-card site-details-row-card-2 radius-bottom-0  position-relative">
                  <div className="col-12 col-sm-3">
                    <div className="site-name-location">
                      <img
                        src={Images.vendor_icon}
                        alt=""
                        className="img-fluid"
                      />
                      <span>{vendorData.vendor?.name}</span>
                    </div>
                  </div>
                  <div className="col-12 col-sm-3">
                    <h6 className="text-uppercase">ADDRESS</h6>
                    <p className="mb-0">{`${vendorData.vendor?.main_address?.street_address || ""
                      } ${vendorData.vendor?.main_address?.city || ""
                      } ${vendorData.vendor?.main_address?.state || ""} ${vendorData.vendor?.main_address?.country || ""
                      }`}</p>
                  </div>
                  <div className="col-12 col-sm-3">
                    <h6 className="text-uppercase">
                      EMAIL ADDRESS
                    </h6>
                    <p className="mb-0">
                      {vendorData.vendor?.main_address?.email || "-"}
                    </p>
                  </div>
                  <div className="col-12 col-sm-3">
                    <h6 className="text-uppercase">PHONE NUMBER</h6>
                    <p className="mb-0">
                      {formatPhone(vendorData.vendor?.main_address?.phone) || "-"}
                    </p>
                  </div>
                  <Dropdown
                    overlayClassName="add-remove-dropdown-main"
                    overlay={() => this.props.vendor_menu(vendorData, index)}
                    trigger={["click"]}
                  >
                    <Button
                      className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                      onClick={(e) => e.preventDefault()}
                    >
                      <img
                        src={Images.more_black}
                        alt=""
                        className="img-fluid"
                      />
                    </Button>
                  </Dropdown>
                </div>
                {/*<div*/}
                {/*    className="row contact-green-small-heading mt-3 position-relative">*/}
                {/*    <h5 className="mb-0 bg-white">QTY</h5>*/}
                {/*</div>*/}

                <div className="row vendor-details-with-warehouse-div">
                  <div className="col-12">
                    <Form.Item
                      className="position-relative"
                      name="item_reference_number"
                      label={"Reference Number"}
                    >
                      <Input
                        placeholder="00000"
                        type="number"
                        onWheel={(event) =>
                          event.currentTarget.blur()
                        }
                        defaultValue={vendorData.reference_number}
                        // onBlur={(e) =>
                        //   this.handleVendorRefNumChange(
                        //     e,
                        //     item,
                        //     index
                        //   )
                        // }
                      />
                    </Form.Item>
                  </div>
                  <div className="col-12">
                    <Form.Item
                      className="position-relative"
                      name="note"
                      label={"Note"}
                    //   rules={[
                    //     {
                    //       required: true,
                    //       message: "this field is required",
                    //     },
                    //   ]}
                    >
                      <Input
                        placeholder="Note"
                        // type="number"
                        onWheel={(event) =>
                          event.currentTarget.blur()
                        }
                        defaultValue={vendorData.note}
                        // onBlur={(e) =>
                        //   this.handleVendorNoteChange(e, item, index)
                        // }
                      />
                    </Form.Item>
                  </div>
                  <div className="col-12 col-sm-6">
                    <Form.Item label={"Margin"} name={"margin"} rules={[{
                                         required: true,
                                         message: "this field is required"
                                     }]}>
                    <Input
                                            placeholder="0.00%"
                                            style={{paddingLeft: 0}}
                                            onBlur={this.onBlurMarginValue}
                                            onFocus={this.onFocusMarginValue}
                                            // formatter={(value) => `${value}%`}
                                            // parser={(value) => value.replace("%", "")}
                                        />
                      {/* <small
                                                        className="vendor-dollar position-absolute">%</small> */}
                    </Form.Item>
                  </div>
                  <div className="col-12 col-sm-6">
                    <Form.Item
                      className="position-relative"
                      name="unit_price"
                      label={"Unit Price"}
                    >
                      <InputNumber
                                            placeholder="0.00"
                                            disabled={true}
                                            style={{paddingLeft: 12}}
                                            formatter={(value) => `$${value}`}
                                        />
                      {/* <small
                        style={{ top: "14px" }}
                        className="position-absolute unit-cost-name"
                      >
                        {selectName}
                      </small> */}
                    </Form.Item>
                  </div>
                  
                  <div className="col-12 col-sm-6">
                    <Form.Item
                      label={"Unit of Measurement *"}
                      name={"unit_type"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
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
                                            // value={this.state.unitType}
                                            // value={(warehouseData?.unit_type === "UOM" ? warehouseData?.uom : `COM_${warehouseData?.com}`)}
                                        >
                                            {this.props.disposal?.uom_array?.map(
                                                (i) => {
                                                    return (
                                                        <Select.Option
                                                            key={i.id}
                                                            value={i.id}
                                                        >
                                                            {i.name} ({i.symbol})
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
                                            {this.props.disposal?.com?.map(
                                                (i) => {
                                                    let COM_ID = `COM_${i.id}`
                                                    return (
                                                        <Select.Option
                                                            key={COM_ID}
                                                            value={COM_ID}
                                                        >
                                                            {i.name} ({i.abbreviation})
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
                                        </Select>
                    </Form.Item>
                    <small className="small-text-input">
                      You're choosing Unit of Measurement's from
                      your pre-
                      <br />
                      selected custom and universal Unit of
                      Measurement.
                    </small>
                  </div>

                  <div className="col-12 col-sm-6">
                    <Form.Item
                      className="position-relative"
                      name="unit_cost"
                      label={"Unit Cost *"}
                      rules={[
                        {
                          required: true,
                          message: "this field is required",
                        },
                      ]}
                    >
                      <InputNumber
                                            placeholder="0.00"
                                            style={{paddingLeft: 12}}
                                            value={vendorData.unit_cost}
                                            formatter={(value) => `$${value}`}
                                            parser={(value) => value.replace("$", "")}
                                        />
                      {/* <small
                        style={{ top: "14px" }}
                        className="position-absolute unit-cost-name"
                      >
                        {selectName}
                      </small> */}
                    </Form.Item>
                  </div>
                  <div className="col-12 validate-div-col text-md-right my-3">
                                    <Form.Item>
                                        <Button className="validate-btn-main" htmlType="submit">
                                            {this.state.edited ? "EDIT" : "ADD"}
                                        </Button>
                                    </Form.Item>
                                </div>
                                <div className="col-12 pb-3">
                                    <div className="row">
                                        {vendorData.price_data?.length ? (

                                                <div
                                                    className="col-12 fleet-kit-table disposal-priceunit-table table-responsive">
                                                    <table className="table">
                                                        <thead>
                                                        <tr>
                                                            {/* <th>TYPE</th> */}
                                                            <th>UOM</th>
                                                            <th>Unit Cost</th>
                                                            <th>Margin</th>
                                                            <th>Price Per Unit</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {vendorData.price_data.map(i => (
                                                            <tr>
                                                                <td>
                                                                    {i.vendor_uom?.symbol || i.vendor_com?.abbreviation || "-"}
                                                                </td>
                                                                <td>{i.unit_cost || "-"}</td>
                                                                <td>{i.margin ? `${parseInt(i.margin).toFixed(2)}%` : "-"}</td>
                                                                <td className="position-relative">{calculatePercentage(i.unit_cost,i.margin)}
                                                                <Dropdown
                                                                        placement="bottomCenter"
                                                                        overlayClassName="add-remove-dropdown-main"
                                                                        overlay={() => this.priceMenu(i)}
                                                                        trigger={["click"]}
                                                                    >
                                                                        <a
                                                                            style={{
                                                                                top: 0,
                                                                                bottom: 0,
                                                                                margin: 'auto',
                                                                                height: '45%'
                                                                            }}
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
                                                                </td>

                                                            </tr>

                                                        ))}

                                                        </tbody>
                                                    </table>
                                                </div>


                                            )

                                            : (
                                                <div className="col-12 mt-3">
                                                    <div
                                                        className="row no-data-card-row align-items-center justify-content-center">
                                                        <img
                                                            src={Images.truck_empty}
                                                            alt={""}
                                                            className="img-fluid"
                                                        />
                                                        <h6 className="mb-0">No Unit Price</h6>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                </div>
                </div>
                
              </div>
            </div>
          </div>
          </Form>
        )
    }

}

export default withRouter(createVendorForms);