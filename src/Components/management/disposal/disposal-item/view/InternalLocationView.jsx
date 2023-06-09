import React, {Component} from "react";
import {
    Button,
    Collapse,
    Dropdown,
    Form,
    Input,
    InputNumber,
    Menu,
    Select,
} from "antd";
import {Image as Images} from "../../../../Images";
import {CaretRightOutlined} from "@ant-design/icons";
import {handleError} from "../../../../../Controller/Global";
import {withRouter} from "react-router-dom";
import {
    getDisposalLocationById,
    getDisposalVendorById,
} from "../../../../../Controller/api/disposalServices";
import {calculatePercentage} from "../../../../../Controller/utils";

const {Option, OptGroup} = Select;
const {Panel} = Collapse;

class InternalLocationView extends Component {
    state = {
        newSites: [],
        newLoc: [],
    };
    // columns = [
    //     {
    //         title: <div>Min QTY<br/>(UOM)</div>,
    //         dataIndex: 'min_qty',
    //         key: 'min_qty',
    //         sorter: true,
    //         render: () => <div className="position-relative">
    //             <InputNumber placeholder={1}/>
    //             <span className="position-absolute add-uom-details">{this.state?.selectOption.children[2]}</span>
    //         </div>,
    //     },
    //     {
    //         title: <div>Max QTY<br/>(UOM)</div>,
    //         dataIndex: 'max_qty',
    //         key: 'max_qty',
    //         sorter: true,
    //         render: () => <div className="position-relative">
    //             <InputNumber placeholder={10}/>
    //             <span className="position-absolute add-uom-details">{this.state?.selectOption.children[2]}</span>
    //         </div>,
    //     },
    //     {
    //         title: <div>QTY<br/>(UOM)</div>,
    //         dataIndex: 'qty',
    //         key: 'qty',
    //         sorter: true,
    //         render: () => <div className="position-relative">
    //             <InputNumber placeholder={5}/>
    //             <span className="position-absolute add-uom-details">{this.state?.selectOption.children[2]}</span>
    //         </div>,
    //     },
    // ];
    // data = [
    //     {
    //         key: 1,
    //         min_qty: '',
    //         max_qty: '',
    //         qty: '',
    //     },
    // ];

    componentDidMount() {
        getDisposalLocationById({disposal: this.props.match.params.id})
            .then((res) => {
                this.setState({newSites: res.data.results[0]?.location || []});
            })
            .catch((err) => {
                handleError(err);
            });
        this.getDisposalVendor();
    }

    getDisposalVendor = () => {
        getDisposalVendorById({disposal: this.props.match.params.id})
            .then((res) => {
                // console.log(res.data.results)
                this.setState({
                    newLoc: res.data.results[0].vendor || [],
                    // selectValue: res.data.results[0].uom?.id
                });
                // this.formRef.current.setFieldsValue({
                //     // vendors: this.state.newLoc?.map(value => {
                //     //     // console.log(value, "--==--")
                //     //     return {value: value.vendor.id, label: value.vendor.name}
                //     // }),
                //     uom: {value: res.data.results[0].uom?.id, label: res.data.results[0].uom?.name}
                // })
            })
            .catch((err) => {
                handleError(err);
            });
    };

    menu = () => (
        <Menu>
            <Menu.Item key="0">
                <Button className="border-0 p-0 shadow-none bg-transparent">
                    Remove
                </Button>
            </Menu.Item>
            <Menu.Item key="1">
                <Button className="border-0 p-0 shadow-none bg-transparent">
                    Edit
                </Button>
            </Menu.Item>
        </Menu>
    );

    handleChange = (value, option) => {
        this.setState({selectValue: value, selectOption: option});
    };

    render() {
        const {disposal, gridChange} = this.props;
        const newItem = disposal?.uom_array?.find((i) => {
            return i.id === this.state.selectValue;
        });
        return (
            <React.Fragment>
                <div className={`col-12 ${this.props.viewTab ? "px-0" : ""}`}>
                    <div
                        className={`row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header ${
                            this.props.viewTab ? "design-update-bar" : ""
                        }`}
                    >
                        <div className="search-bar-div d-flex align-items-center">
                            <Form className="position-relative">
                                <Input placeholder="Search"/>
                                <Button className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                                    <img
                                        src={Images.search_icon_gray}
                                        className="img-fluid"
                                        alt="search icon"
                                    />
                                </Button>
                            </Form>
                        </div>
                        <ul className="mb-0 d-flex align-items-center list-inline">
                            {/*<li className="list-inline-item">*/}
                            {/*    <Select*/}
                            {/*        dropdownClassName={'custom-uom-dropdown'}*/}
                            {/*        placeholder="Unit of Measurement: pieces (pc)"*/}
                            {/*        suffixIcon={*/}
                            {/*            <img src={Images.arrow_small_gray_icon} alt={""} className="img-fluid"/>*/}
                            {/*        }*/}
                            {/*        className="unit-measurement-select"*/}
                            {/*        onChange={this.handleChange}*/}
                            {/*        value={this.state?.selectValue}*/}
                            {/*    >*/}
                            {/*        <OptGroup label="Universal UOM">*/}
                            {/*            {disposal?.uom_array?.map(i => {*/}
                            {/*                return (*/}
                            {/*                    <Option value={i.id} key={i.id}><span className="check-icon-mark">*/}
                            {/*                <img src={Images.check_icon_green} alt="" className="img-fluid"/>*/}
                            {/*            </span> {i.name} ({i.symbol})</Option>*/}
                            {/*                )*/}
                            {/*            })}*/}
                            {/*        </OptGroup>*/}
                            {/*        /!* <OptGroup label="Custom UOM">*/}
                            {/*            {inventory?.com?.map((i, idx) => {*/}
                            {/*                return (*/}
                            {/*                    <Option value={i.id} key={i + idx}> <span className="check-icon-mark">*/}
                            {/*                    <img src={Images.check_icon_green} alt="" className="img-fluid"/>*/}
                            {/*                    </span>{i.name}</Option>*/}
                            {/*                )*/}
                            {/*            })}*/}
                            {/*        </OptGroup> *!/*/}
                            {/*    </Select>*/}
                            {/*</li>*/}
                            <li className="list-inline-item">
                                {!this.props.viewTab && (
                                    // (!this.props.match.url.includes('inventory') &&
                                    //     <Button className="edit-btn-summary">
                                    //         <img src={Images.pencil_green} alt="" className="img-fluid"/>
                                    //         Edit
                                    //     </Button>)
                                    // :
                                    <Button
                                        className="view-all-btn text-uppercase"
                                        onClick={() => this.props.tabChange("3")}
                                    >
                                        VIEW ALL{" "}
                                    </Button>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-12 my-3">
                    {/*<Collapse*/}
                    {/*    className={`inner-collapse-section ${this.props.editBtn ? "border-add" : ""}`}*/}
                    {/*    accordion*/}
                    {/*    defaultActiveKey={['1']}*/}
                    {/*    expandIcon={({isActive}) => <CaretRightOutlined*/}
                    {/*        rotate={isActive ? 90 : 0}/>}*/}

                    {/*>*/}
                    <>
                        {gridChange ?
                            <div className="row design-update-warehouse-vendor-row">
                                <div className={"col-12"}>
                                    <div className="row">
                                        {this.state.newSites?.length > 0 &&
                                            this.state.newSites?.map((i) => {
                                                const selectName = i?.unit_type === "COM" ? this.props.disposal?.com?.find(c => c.id === i.com)?.abbreviation : this.props.disposal?.uom_array?.find(
                                                    (n) => n.id === i.uom
                                                )?.symbol;
                                                return (
                                                    // <Panel header={
                                                    <div className="col-12 margin-btn-30">
                                                        <div
                                                            className="row m-0 site-details-row-card site-card-grid-change site-details-row-card-2 details-div-update  position-relative">
                                                            <div className="col-12 py-0 bg-transparent border-0">
                                                                <div className="row">
                                                                    <div className="col-12 col-sm-3 h-auto site-details-heading">
                                                                        <div className="site-name-location h-auto">
                                                                            <img
                                                                                src={Images.location_black_icon}
                                                                                alt=""
                                                                                className="img-fluid"
                                                                            />
                                                                            <span>{i?.internal_location?.name}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 col-sm-9 h-auto site-common-details" style={{"borderBottom" : "1px solid #e0e0e0"}}>
                                                                        <div className="row site-common-details-row h-auto">
                                                                            <div className="col-12 col-sm-4">
                                                                                <h6 className="text-uppercase">ADDRESS</h6>
                                                                                <p className="mb-0">{`${i.internal_location?.street_address} ${i.internal_location?.name} ${i.internal_location?.city} ${i.internal_location?.state} ${i.internal_location?.country}`}</p>
                                                                            </div>
                                                                            <div className="col-12 col-sm-4">
                                                                                <h6 className="text-uppercase">
                                                                                    EMAIL ADDRESS
                                                                                </h6>
                                                                                <p className="mb-0">
                                                                                    {i?.internal_location?.email}
                                                                                </p>
                                                                            </div>
                                                                            <div className="col-12 col-sm-4">
                                                                                <h6 className="text-uppercase">
                                                                                    PHONE NUMBER
                                                                                </h6>
                                                                                <p className="mb-0">
                                                                                    {i?.internal_location?.phone}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                                <div className="row">
                                                                            
                                                                                    <div className="col-12 py-3">
                                    <div className="row">
                                        {i.price_data?.length ? (

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
                                                        {i.price_data.map(d => (
                                                            <tr>
                                                                <td>
                                                                    {d.uom?.symbol || d.com?.abbreviation || "-"}
                                                                </td>
                                                                <td>{`$${d.unit_cost}` || "-"}</td>
                                                                <td>{d.min_qty || "-"}</td>
                                                                <td>{d.max_qty || "-"}</td>
                                                                <td>{d.qty || "-"}</td>
                                                                <td>{d.margin ? `${parseInt(d.margin).toFixed(2)}%` : "-"}</td>
                                                                {/* <td className="position-relative">{parseInt((d.unit_cost + (d.unit_cost * d.margin))).toFixed(2)} */}
                                                                <td className="position-relative">{`$${calculatePercentage(d.unit_cost,d.margin)}`}
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
                                                   
                                                );
                                            })}
                                        {this.state.newSites.length == 0 && (
                                            <div className="col-12">
                                                <div className="row mx-0 bg-white common-card-upload mb-3">
                                                    <div className="col-12 text-center">
                                                        <img
                                                            src={Images.location_gray}
                                                            alt={""}
                                                            className="img-fluid"
                                                        />
                                                        <h6 className="mb-0 color-gray-3">No Warehouses</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={"col-12"}>
                                    <div className="row">
                                        {this.state.newLoc?.length > 0 &&
                                            this.state.newLoc?.map((i) => {
                                                const selectName = i?.unit_type === "COM" ? this.props.disposal?.com?.find(c => c.id === i.vendor_com)?.abbreviation : this.props.disposal?.uom_array?.find(
                                                    (n) => n.id === i.vendor_uom
                                                )?.symbol;
                                                return (
                                                    // <Panel header={
                                                    <React.Fragment>
                                                        {/* <div className="col-12 divider-line"/> */}
                                                        <div className="col-12 margin-btn-30">
                                                            <div
                                                                className="row m-0 site-details-row-card site-card-grid-change site-details-row-card-2 details-div-update  position-relative">
                                                                <div className="col-12 py-0 bg-transparent border-0">
                                                                    <div className="row">
                                                                        <div className="col-12 col-sm-3 h-auto site-details-heading">
                                                                            <div className="site-name-location h-auto">
                                                                                <img
                                                                                    src={Images.vendor_icon}
                                                                                    alt=""
                                                                                    className="img-fluid"
                                                                                />
                                                                                <span>{i?.vendor?.name}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-12 col-sm-9 h-auto site-common-details" style={{"borderBottom" : "1px solid #e0e0e0"}}>
                                                                            <div
                                                                                className="row site-common-details-row h-auto">
                                                                                <div className="col-12 col-sm-4">
                                                                                    <h6 className="text-uppercase">
                                                                                        ADDRESS
                                                                                    </h6>
                                                                                    <p className="mb-0">{`${
                                                                                        i.vendor.street_address || ""
                                                                                    } ${i.vendor.name} ${
                                                                                        i.vendor.city || ""
                                                                                    } ${i.vendor.state || ""} ${
                                                                                        i.vendor.country || ""
                                                                                    }`}</p>
                                                                                </div>
                                                                                <div className="col-12 col-sm-4">
                                                                                    <h6 className="text-uppercase">
                                                                                        EMAIL ADDRESS
                                                                                    </h6>
                                                                                    <p className="mb-0">
                                                                                        {i?.vendor?.email || "-"}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="col-12 col-sm-4">
                                                                                    <h6 className="text-uppercase">
                                                                                        PHONE NUMBER
                                                                                    </h6>
                                                                                    <p className="mb-0">
                                                                                        {i?.internal_location?.phone || "-"}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                           
                                                                        </div>
                                                                        {/* <Dropdown overlayClassName="add-remove-dropdown-main" overlay={this.menu}
                                                      trigger={['click']}>
                                                <Button
                                                    className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                                                    onClick={e => e.preventDefault()}>
                                                    <img src={Images.more_black} alt="" className="img-fluid"/>
                                                </Button>
                                            </Dropdown> */}
                                                                    </div>
                                                                    <div className="row">
                                                                                
                                                                                    <div className="col-12 py-3">
                                    <div className="row">
                                        {i.price_data?.length ? (

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
                                                        {i.price_data.map(d => (
                                                            <tr>
                                                                <td>
                                                                    {d.vendor_uom?.symbol || d.vendor_com?.abbreviation || "-"}
                                                                </td>
                                                                <td>{`$${d.unit_cost}` || "-"}</td>
                                                                <td>{d.margin ? `${parseInt(d.margin).toFixed(2)}%` : "-"}</td>
                                                                <td className="position-relative">{`$${calculatePercentage(d.unit_cost,d.margin)}`}
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
                                                    </React.Fragment>
                                                    // } key={i.id}>
                                                    // <div className="row mx-0">
                                                    //     <div className="col-12 p-0 table-responsive custom-internal-location">
                                                    //         <div className="row mx-0 custom-table-thead">
                                                    //             <div className="custom-th-main">
                                                    //                 <div>Min QTY<br/>(UOM)</div>
                                                    //             </div>
                                                    //             <div className="custom-th-main">
                                                    //                 <div>Max QTY<br/>(UOM)</div>
                                                    //             </div>
                                                    //             <div className="custom-th-main">
                                                    //                 <div>QTY<br/>(UOM)</div>
                                                    //             </div>
                                                    //         </div>
                                                    //         <div className="row mx-0 custom-table-tbody">
                                                    //             <div className="custom-td position-relative">
                                                    //                 <InputNumber placeholder='' disabled
                                                    //                              defaultValue={i.min_qty || 0}/>
                                                    //                 <small style={{top: '22px'}}
                                                    //                        className="position-absolute unit-cost-name">
                                                    //                     {newItem?.symbol}
                                                    //                 </small></div>
                                                    //             <div className="custom-td position-relative">
                                                    //                 <InputNumber placeholder='' disabled
                                                    //                              defaultValue={i.max_qty || 0}/>
                                                    //                 <small style={{top: '22px'}}
                                                    //                        className="position-absolute unit-cost-name">
                                                    //                     {newItem?.symbol}
                                                    //                 </small></div>
                                                    //             <div className="custom-td position-relative">
                                                    //                 <InputNumber placeholder='' disabled defaultValue={i.qty || 0}/>
                                                    //                 <small style={{top: '22px'}}
                                                    //                        className="position-absolute unit-cost-name">
                                                    //                     {newItem?.symbol}
                                                    //                 </small></div>
                                                    //         </div>
                                                    //         {/* <InputNumber value={item.qty} onChange={value => this.handleEmailListChange(value, item, index)}>
                                                    //                                                     </InputNumber>  */}
                                                    //     </div>
                                                    // </div>
                                                    // <div
                                                    //     className="row mx-0 my-3 location-row-main-3 contact-green-small-heading position-relative">
                                                    //     <h5 className="mb-0 bg-gray-main">Unit Cost</h5>
                                                    // </div>
                                                    // <div className="row view-cost-input">
                                                    //     <div className="col-12 col-sm-4">
                                                    //         {/*<label className="mt-3" style={{fontWeight: '500'}}>Unit Cost</label>*/}
                                                    //         <div className="row">
                                                    //             <div className="col-12">
                                                    //                 <InputNumber placeholder='' disabled
                                                    //                              defaultValue={i.unit_cost || 0}/>
                                                    //                 <small style={{top: '13px', right: '30px'}}
                                                    //                        className="position-absolute unit-cost-name">
                                                    //                     {newItem?.symbol}
                                                    //                 </small>
                                                    //             </div>
                                                    //         </div>
                                                    //     </div>
                                                    // </div>
                                                    // </Panel>
                                                );
                                            })}
                                        {this.state.newLoc.length == 0 && (
                                            <div className="col-12">
                                                <div className="row mx-0 bg-transparent common-card-upload mb-3">
                                                    <div className="col-12 text-center">
                                                        <img
                                                            src={Images.vendor_gray_icon}
                                                            alt={""}
                                                            className="img-fluid"
                                                        />
                                                        <h6 className="mb-0 color-gray-3">No Vendors</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="row design-update-warehouse-vendor-row">
                                <div className={"col-12 col-sm-6"}>
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <h6 className="text-uppercase">WareHouse</h6>
                                        </div>
                                        {this.state.newSites?.length > 0 &&
                                            this.state.newSites?.map((i) => {
                                                const selectName = i?.unit_type === "COM" ? this.props.disposal?.com?.find(c => c.id === i.com)?.abbreviation : this.props.disposal?.uom_array?.find(
                                                    (n) => n.id === i.uom
                                                )?.symbol;
                                                // console.log(selectName, "internal location unit")
                                                return (
                                                    // <Panel header={
                                                    <div className="col-12 margin-btn-30">
                                                        <div
                                                            className="row m-0 site-details-row-card site-details-row-card-2 details-div-update  position-relative">
                                                            <div className="col-12 py-0 bg-transparent border-0">
                                                                <div className="row">
                                                                    <div className="col-12 site-details-heading">
                                                                        <div className="site-name-location">
                                                                            <img
                                                                                src={Images.location_black_icon}
                                                                                alt=""
                                                                                className="img-fluid"
                                                                            />
                                                                            <span>{i?.internal_location?.name}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-12 pb-0">
                                                                        <div className="row site-common-details-row">
                                                                            <div className="col-12 col-sm-4">
                                                                                <h6 className="text-uppercase">ADDRESS</h6>
                                                                                <p className="mb-0">{`${i.internal_location?.street_address} ${i.internal_location?.name} ${i.internal_location?.city} ${i.internal_location?.state} ${i.internal_location?.country}`}</p>
                                                                            </div>
                                                                            <div className="col-12 col-sm-4">
                                                                                <h6 className="text-uppercase">
                                                                                    EMAIL ADDRESS
                                                                                </h6>
                                                                                <p className="mb-0">
                                                                                    {i?.internal_location?.email}
                                                                                </p>
                                                                            </div>
                                                                            <div className="col-12 col-sm-4">
                                                                                <h6 className="text-uppercase">
                                                                                    PHONE NUMBER
                                                                                </h6>
                                                                                <p className="mb-0">
                                                                                    {i?.internal_location?.phone}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/* <Dropdown overlayClassName="add-remove-dropdown-main" overlay={this.menu}
                                                      trigger={['click']}>
                                                <Button
                                                    className="ant-dropdown-link ant-dropdown-link-2 border-0 p-0 bg-transparent shadow-none"
                                                    onClick={e => e.preventDefault()}>
                                                    <img src={Images.more_black} alt="" className="img-fluid"/>
                                                </Button>
                                            </Dropdown> */}
                                                                </div>
                                                                <div className="row">
                                                                            
                                                                                    <div className="col-12 py-3">
                                    <div className="row">
                                        {i.price_data?.length ? (

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
                                                        {i.price_data.map(d => (
                                                            <tr>
                                                                <td>
                                                                    {d.uom?.symbol || d.com?.abbreviation || "-"}
                                                                </td>
                                                                <td>{d.unit_cost || "-"}</td>
                                                                <td>{d.min_qty || "-"}</td>
                                                                <td>{d.max_qty || "-"}</td>
                                                                <td>{d.qty || "-"}</td>
                                                                <td>{d.margin ? `${parseInt(d.margin).toFixed(2)}%` : "-"}</td>
                                                                {/* <td className="position-relative">{parseInt((d.unit_cost + (d.unit_cost * d.margin))).toFixed(2)} */}
                                                                <td className="position-relative">{calculatePercentage(d.unit_cost,d.margin)}
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
                                                    // } key={i.id}>
                                                    // <div className="row mx-0">
                                                    //     <div className="col-12 p-0 table-responsive custom-internal-location">
                                                    //         <div className="row mx-0 custom-table-thead">
                                                    //             <div className="custom-th-main">
                                                    //                 <div>Min QTY<br/>(UOM)</div>
                                                    //             </div>
                                                    //             <div className="custom-th-main">
                                                    //                 <div>Max QTY<br/>(UOM)</div>
                                                    //             </div>
                                                    //             <div className="custom-th-main">
                                                    //                 <div>QTY<br/>(UOM)</div>
                                                    //             </div>
                                                    //         </div>
                                                    //         <div className="row mx-0 custom-table-tbody">
                                                    //             <div className="custom-td position-relative">
                                                    //                 <InputNumber placeholder='' disabled
                                                    //                              defaultValue={i.min_qty || 0}/>
                                                    //                 <small style={{top: '22px'}}
                                                    //                        className="position-absolute unit-cost-name">
                                                    //                     {newItem?.symbol}
                                                    //                 </small></div>
                                                    //             <div className="custom-td position-relative">
                                                    //                 <InputNumber placeholder='' disabled
                                                    //                              defaultValue={i.max_qty || 0}/>
                                                    //                 <small style={{top: '22px'}}
                                                    //                        className="position-absolute unit-cost-name">
                                                    //                     {newItem?.symbol}
                                                    //                 </small></div>
                                                    //             <div className="custom-td position-relative">
                                                    //                 <InputNumber placeholder='' disabled defaultValue={i.qty || 0}/>
                                                    //                 <small style={{top: '22px'}}
                                                    //                        className="position-absolute unit-cost-name">
                                                    //                     {newItem?.symbol}
                                                    //                 </small></div>
                                                    //         </div>
                                                    //         {/* <InputNumber value={item.qty} onChange={value => this.handleEmailListChange(value, item, index)}>
                                                    //                                                     </InputNumber>  */}
                                                    //     </div>
                                                    // </div>
                                                    // <div
                                                    //     className="row mx-0 my-3 location-row-main-3 contact-green-small-heading position-relative">
                                                    //     <h5 className="mb-0 bg-gray-main">Unit Cost</h5>
                                                    // </div>
                                                    // <div className="row view-cost-input">
                                                    //     <div className="col-12 col-sm-4">
                                                    //         {/*<label className="mt-3" style={{fontWeight: '500'}}>Unit Cost</label>*/}
                                                    //         <div className="row">
                                                    //             <div className="col-12">
                                                    //                 <InputNumber placeholder='' disabled
                                                    //                              defaultValue={i.unit_cost || 0}/>
                                                    //                 <small style={{top: '13px', right: '30px'}}
                                                    //                        className="position-absolute unit-cost-name">
                                                    //                     {newItem?.symbol}
                                                    //                 </small>
                                                    //             </div>
                                                    //         </div>
                                                    //     </div>
                                                    // </div>
                                                    // </Panel>
                                                );
                                            })}
                                        {this.state.newSites.length == 0 && (
                                            <div className="col-12">
                                                <div className="row mx-0 bg-white common-card-upload">
                                                    <div className="col-12 text-center">
                                                        <img
                                                            src={Images.location_gray}
                                                            alt={""}
                                                            className="img-fluid"
                                                        />
                                                        <h6 className="mb-0 color-gray-3">No Warehouses</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={"col-12 col-sm-6"}>
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <h6 className="text-uppercase">Vendor</h6>
                                        </div>
                                        {this.state.newLoc?.length > 0 &&
                                            this.state.newLoc?.map((i) => {
                                                const selectName = i?.unit_type === "COM" ? this.props.disposal?.com?.find(c => c.id === i.vendor_com)?.abbreviation : this.props.disposal?.uom_array?.find(
                                                    (n) => n.id === i.vendor_uom
                                                )?.symbol;
                                                return (
                                                    // <Panel header={
                                                    <React.Fragment>
                                                        {/* <div className="col-12 divider-line"/> */}
                                                        <div className="col-12 margin-btn-30">
                                                            <div
                                                                className="row m-0 site-details-row-card site-details-row-card-2 details-div-update  position-relative">
                                                                <div className="col-12 py-0 bg-transparent border-0">
                                                                    <div className="row">
                                                                        <div className="col-12 site-details-heading">
                                                                            <div className="site-name-location">
                                                                                <img
                                                                                    src={Images.vendor_icon}
                                                                                    alt=""
                                                                                    className="img-fluid"
                                                                                />
                                                                                <span>{i?.vendor?.name}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-12 pb-0">
                                                                            <div
                                                                                className="row site-common-details-row">
                                                                                <div className="col-12 col-sm-4">
                                                                                    <h6 className="text-uppercase">
                                                                                        ADDRESS
                                                                                    </h6>
                                                                                    <p className="mb-0">{`${
                                                                                        i.vendor.street_address || ""
                                                                                    } ${i.vendor.name} ${
                                                                                        i.vendor.city || ""
                                                                                    } ${i.vendor.state || ""} ${
                                                                                        i.vendor.country || ""
                                                                                    }`}</p>
                                                                                </div>
                                                                                <div className="col-12 col-sm-4">
                                                                                    <h6 className="text-uppercase">
                                                                                        EMAIL ADDRESS
                                                                                    </h6>
                                                                                    <p className="mb-0">
                                                                                        {i?.vendor?.email || "-"}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="col-12 col-sm-4">
                                                                                    <h6 className="text-uppercase">
                                                                                        PHONE NUMBER
                                                                                    </h6>
                                                                                    <p className="mb-0">
                                                                                        {i?.internal_location?.phone || "-"}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row">
                                                                            <div className="col-12 pb-3">
                                    <div className="row">
                                        {i.price_data?.length ? (

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
                                                        {i.price_data.map(d => (
                                                            <tr>
                                                                <td>
                                                                    {d.vendor_uom?.symbol || d.vendor_com?.abbreviation || "-"}
                                                                </td>
                                                                <td>{d.unit_cost || "-"}</td>
                                                                <td>{d.margin ? `${parseInt(d.margin).toFixed(2)}%` : "-"}</td>
                                                                <td className="position-relative">{calculatePercentage(d.unit_cost,d.margin)}
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
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            })}
                                        {this.state.newLoc.length == 0 && (
                                            <div className="col-12">
                                                <div className="row mx-0 bg-transparent common-card-upload">
                                                    <div className="col-12 text-center">
                                                        <img
                                                            src={Images.vendor_gray_icon}
                                                            alt={""}
                                                            className="img-fluid"
                                                        />
                                                        <h6 className="mb-0 color-gray-3">No Vendors</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        }
                    </>

                    {/*<div className="col-12 divider-line mt-4"/>*/}
                    {/*</Collapse>*/}
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(InternalLocationView);
