import {Button, Dropdown, Form, Input, InputNumber, Menu, Select} from "antd";
import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {
    createDisposalLocation,
    deleteDisposalPrice,
    updateDisposalPrice
} from "../../../../../Controller/api/disposalServices";
import {handleError} from "../../../../../Controller/Global";
import {calculatePercentage, formatPhone} from "../../../../../Controller/utils";
import {Image as Images} from "../../../../Images";

class createWarehouseForms extends Component {
    formRef = React.createRef();
    state = {
        unitValue: "",
        unitCost: "",
        edited: false,
        unitType: "",
        tableData: "",
        uomData: "",
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
        deleteDisposalPrice(id).then((res) => {
            this.props.getDisposalLocation()
        })
    }

    handleEditPrice = (data) => {
        this.setState({edited: true, tableData: data, uomData: data.uom?.symbol || data.com?.abbreviation})
        this.formRef.current.setFieldsValue({
            margin: `${parseInt(data.margin).toFixed(2)}%`,
            max_qty: data.max_qty,
            min_qty: data.min_qty,
            qty: data.qty,
            unit_cost: data.unit_cost,
            unit_type: data.unit_type === "UOM" ? data.uom?.id : `COM_${data.com?.id}`
        })
        const unitPrice = calculatePercentage(data.unit_cost,data.margin)
        this.formRef.current.setFieldsValue({
          unit_price: unitPrice
        })
    }

    handleAddData = (val) => {
        console.log(val,"value on add")
        this.setState({uomData:""})
        if (this.state.edited) {
            const editedData = {
                ...val,
                margin: val.margin.split(".")[0]
            }
            if (isNaN(parseInt(val.unit_type))) {
                editedData['unit_type'] = "COM"
                editedData['com'] = val.unit_type.split("_")[1]

            } else {
                editedData['unit_type'] = "UOM"
                editedData['uom'] = val.unit_type
            }
            updateDisposalPrice(this.state.tableData.id, editedData).then((res => {
                this.props.getDisposalLocation()
                this.formRef.current.setFieldsValue({
                    margin: "",
                    min_qty: "",
                    max_qty: "",
                    qty: "",
                    unit_cost: "",
                    unit_type: null,
                    unit_price: ""
                })
            })).catch(err => {
                handleError(err)
            })
            this.setState({edited: false})

        } else {
            const Id = this.props.disposal.id;
            const data = {
                disposal: Id,
                single_location_id: this.props.warehouseData.id,
                price_data: {
                    "min_qty": val.min_qty,
                    "max_qty": val.max_qty,
                    "qty": val.qty,
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
            createDisposalLocation(data).then((res) => {
                this.props.getDisposalLocation()
                this.setState({unitCost: 0})
                this.formRef.current.setFieldsValue({
                    margin: "",
                    min_qty: "",
                    max_qty: "",
                    qty: "",
                    unit_cost: "",
                    unit_type: null,
                    unit_price: ""
                })
            }).catch((err) => {
                handleError(err)
            })
        }

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

    handleUomValue = (val) => {
        if(typeof val === "number"){
            let uomValue = this.props.disposal.uom_array.find(i => i.id == val)
            this.setState({uomData: uomValue.symbol })
        } else {
            let comVal = val.split("_")
            let comValue = this.props.disposal.com.find(i=> i.id == comVal[1])
            this.setState({uomData: comValue.abbreviation})
        }

    }

    onBlurMarginValue = (e) => {
        if(e.target.value) {
        this.formRef.current.setFieldsValue({margin: `${parseInt(e.target.value).toFixed(2)}%`})
        }

    }

    onFocusMarginValue = (e) => {
        console.log(e.target.value,"values")
        this.formRef.current.setFieldsValue({margin: e.target.value.replace("%", "")})
    }


    render() {
        const {warehouseData, index} = this.props;
        return (
            <Form
                ref={this.formRef}
                layout={'vertical'}
                onFinish={this.handleAddData}
                hideRequiredMark={true}
                onValuesChange={this.onValuesChange}
                className="main-inner-form"
            >
                <div
                    className="col-12 location-row-main border-0 mb-0"
                >
                    <div className="row mx-0">
                        <div className="col-12">
                            <div
                                className="row site-details-row-card site-details-row-card-2 radius-bottom-0  position-relative">
                                <div className="col-12 col-sm-3">
                                    <div className="site-name-location">
                                        <img
                                            src={Images.location_black_icon}
                                            alt=""
                                            className="img-fluid"
                                        />
                                        <span>{warehouseData.internal_location.name}</span>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-3">
                                    <h6 className="text-uppercase">ADDRESS</h6>
                                    <p className="mb-0">{`${warehouseData.internal_location.street_address} ${warehouseData.internal_location.name} ${warehouseData.internal_location.city} ${warehouseData.internal_location.state} ${warehouseData.internal_location.country}`}</p>
                                </div>
                                <div className="col-12 col-sm-3">
                                    <h6 className="text-uppercase">
                                        EMAIL ADDRESS
                                    </h6>
                                    <p className="mb-0">
                                        {warehouseData.internal_location.email}
                                    </p>
                                </div>
                                <div className="col-12 col-sm-3">
                                    <h6 className="text-uppercase">PHONE NUMBER</h6>
                                    <p className="mb-0">
                                        {formatPhone(warehouseData.internal_location.phone)}
                                    </p>
                                </div>
                                <Dropdown
                                    overlayClassName="add-remove-dropdown-main"
                                    overlay={() => this.props.menu(warehouseData, index)}
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

                            <div className="row rounded-0 border-bottom-0 vendor-details-with-warehouse-div">
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
                                            defaultValue={warehouseData.reference_number}

                                        />
                                    </Form.Item>

                                </div>
                                <div className="col-12">
                                    <Form.Item
                                        className="position-relative"
                                        name="note"
                                        label={"Note"}

                                    >
                                        <Input
                                            placeholder="Note"
                                            onWheel={(event) =>
                                                event.currentTarget.blur()
                                            }
                                            defaultValue={warehouseData.note}

                                        />
                                    </Form.Item>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <Form.Item label={"Margin*"} name={"margin"}
                                     rules={[{
                                         required: true,
                                         message: "this field is required"
                                     }]}
                                    >
                                        <Input
                                            placeholder="0.00%"
                                            style={{paddingLeft: 0}}
                                            // value={this.state.marginVal}
                                            onBlur={this.onBlurMarginValue}
                                            onFocus={this.onFocusMarginValue}
                                            // formatter={(value) => `${value}%`}
                                            // parser={(value) => value.replace("%", "")}
                                        />
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
                                        {/*<small*/}
                                        {/*    style={{top: "14px"}}*/}
                                        {/*    className="position-absolute unit-cost-name"*/}
                                        {/*>*/}
                                        {/*    {this.props.selectName}*/}
                                        {/*</small>*/}
                                    </Form.Item>
                                    <small
                                                className="position-absolute unit-cost-name unit-uom"
                                            >
                                                {this.state.uomData}
                                                {/* {this.props.selectName} */}
                                            </small>
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
                                            onChange = {this.handleUomValue}
                                            value={this.state.unitType}
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
                                        <br/>
                                        selected custom and universal Unit of
                                        Measurement.
                                    </small>
                                </div>
                                
                                <div className="col-12 col-sm-6">
                                    <Form.Item
                                        className="position-relative"
                                        name={"unit_cost"}
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
                                            value={this.state.unitCost || warehouseData.unit_cost}
                                            formatter={(value) => `$${value}`}
                                            parser={(value) => value.replace("$", "")}
                                            
                                        />
                                        
                                        {/* <small
                                            style={{top: "14px"}}
                                           className="position-absolute unit-cost-name"
                                       >
                                            {this.state.uomData}
                                        </small>  */}
                                    </Form.Item>
                                    <small
                                                className="position-absolute unit-cost-name unit-uom"
                                            >
                                                {this.state.uomData}
                                                {/* {this.props.selectName} */}
                                            </small>
                                </div>
                            </div>

                            <div className="row custom-design-update">
                                <div className="col-12 table-responsive custom-internal-location">
                                    <div className="row mx-0 custom-table-thead">
                                        <div className="custom-th-main">
                                            <div>Min QTY</div>
                                        </div>
                                        <div className="custom-th-main">
                                            <div>
                                                Max QTY
                                                <br/>
                                                <span className="font-weight-light">
                          (CAPACITY)
                        </span>
                                            </div>
                                        </div>
                                        <div className="custom-th-main">
                                            <div>QTY</div>
                                        </div>
                                    </div>
                                    <div className="row mx-0 custom-table-tbody">
                                        <div className="custom-td position-relative">
                                            <Form.Item name={"min_qty"}>
                                                <InputNumber
                                                />
                                            </Form.Item>
                                            <small
                                                style={{top: "22px"}}
                                                className="position-absolute unit-cost-name"
                                            >
                                                {this.state.uomData}
                                                {/* {this.props.selectName} */}
                                            </small>
                                        </div>
                                        <div className="custom-td position-relative">
                                            <Form.Item name={"max_qty"}>
                                                <InputNumber
                                                />
                                            </Form.Item>
                                            <small
                                                style={{top: "22px"}}
                                                className="position-absolute unit-cost-name"
                                            >
                                                {this.state.uomData}
                                            </small>
                                        </div>
                                        <div className="custom-td position-relative">
                                            <Form.Item name={"qty"}>
                                                <InputNumber

                                                />
                                            </Form.Item>
                                            <small
                                                style={{top: "22px"}}
                                                className="position-absolute unit-cost-name"
                                            >
                                                {this.state.uomData}
                                            </small>
                                        </div>
                                    </div>
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
                                        {warehouseData.price_data?.length ? (

                                                <div
                                                    className="col-12 fleet-kit-table disposal-priceunit-table table-responsive">
                                                    <table className="table">
                                                        <thead>
                                                        <tr>
                                                            {/* <th>TYPE</th> */}
                                                            <th>UOM</th>
                                                            <th>Unit Cost</th>
                                                            <th>Min QTY</th>
                                                            <th>Max QTY</th>
                                                            <th>Current QTY</th>
                                                            <th>Margin</th>
                                                            <th>PRICE PER UNIT</th>

                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {warehouseData.price_data.map(i => (
                                                            <tr>
                                                                <td>
                                                                    {i.uom?.symbol || i.com?.abbreviation || "-"}
                                                                </td>
                                                                <td>{i.unit_cost || "-"}</td>
                                                                <td>{i.min_qty || "-"}</td>
                                                                <td>{i.max_qty || "-"}</td>
                                                                <td>{i.qty || "-"}</td>
                                                                <td>{i.margin ? `${parseInt(i.margin).toFixed(2)}%` : "-"}</td>
                                                                {/* <td className="position-relative">{parseInt((i.unit_cost + (i.unit_cost * i.margin))).toFixed(2)} */}
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

export default withRouter(createWarehouseForms);