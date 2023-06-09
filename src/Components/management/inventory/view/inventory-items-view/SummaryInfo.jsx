import React, {Component} from "react";
import {Breadcrumb, Button, Collapse, Spin} from "antd";
import {Image as Images} from "../../../../Images";
import {CaretRightOutlined} from "@ant-design/icons";
import {handleError} from "../../../../../Controller/Global";
import {getInventoryById, getInventoryKit,} from "../../../../../Controller/api/inventoryServices";
import {routes} from "../../../../../Controller/Routes";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../../../Store/actions/breadcrumbAction";
import {Link, withRouter} from "react-router-dom";
import InternalLocationView from "./InternalLocationView";
import VendorView from "./VendorView";
import DocumentsView from "./DocumentsView";
import InventoryKitView from "./InventoryKitView";
import {history} from "../../../../../Controller/history";
import {reverse} from "named-urls/dist/index.es";
import {calculatePercentage, formatMoney} from "../../../../../Controller/utils";
import UnitConverterInventory from "./UnitConverterInventory";
import UniversalMeasurementInVentoryView from "./UniversalMeasurementInVentoryView";
import CustomUnitMeasurementsInventoryView from "./CustomUnitMeasurementsInventoryView";

const {Panel} = Collapse;

class SummaryInfo extends Component {
    state = {
        kits: [],
        vendors: 0,
        inventory: null,
        loading: true,
    };

    componentDidMount() {
        this.setState({loading: true});
        if (this.props.match.params.id) {
            getInventoryById(this.props.match.params.id)
                .then((res) => {
                    let arrIn = [
                        {
                            title: "Inventory",
                            url: routes.dashboard.management.inventory.self,
                        },
                        {
                            title: "Inventory Items",
                            url: routes.dashboard.management.inventory.self,
                        },
                        {title: res.data.name, url: "#"},
                    ];
                    this.props.setBreadcrumb(arrIn);
                    this.setState({inventory: res.data, loading: false});
                })
                .catch((err) => {
                    handleError(err);
                    this.setState({loading: false});
                });
            getInventoryKit({inventory: this.props.match.params.id})
                .then((res) => {
                    this.setState({kits: res.data.results});
                })
                .catch((err) => {
                    handleError(err);
                });
        }
    }

    render() {
        let {inventory, loading, newPrice} = this.state;
        if (loading) {
            return (
                <div className="text-center my-4">
                    <Spin/>
                </div>
            );
        }
        return (
            <React.Fragment>
                <div className="row summary-info-inner-row inventory-items-inner-row">
                    <div className="col-12">
                        <Collapse
                            // accordion
                            defaultActiveKey={["1"]}
                            expandIcon={({isActive}) => (
                                <CaretRightOutlined rotate={isActive ? 90 : 0}/>
                            )}
                        >
                            <Panel
                                header={
                                    <div
                                        className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                    <span>
                      General Information  <sup>*</sup>
                    </span>
                                        <Button
                                            onClick={() =>
                                                history.push({
                                                  pathname: reverse(routes.dashboard.management.inventory.inventory_items.edit,
                                                    { id: this.props.match.params.id }
                                                  ),
                                                  editTab: "1"
                                                })
                                              }
                                            className="edit-btn-summary"
                                        >
                                            <img
                                                src={Images.pencil_green}
                                                alt=""
                                                className="img-fluid"
                                            />
                                            Edit
                                        </Button>
                                    </div>
                                }
                                key="1"
                            >
                                <div className="row summary-collapse-inner-row-main">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                <h6 className="text-uppercase">Inventory ID</h6>
                                                <h5>{inventory.id}</h5>
                                            </div>
                                            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                <h6 className="text-uppercase">Inventory item name</h6>
                                                <h5>{inventory.name}</h5>
                                            </div>
                                            <div className="col-12 col-sm-6 col-md-4 col-lg-6">
                                                <h6 className="text-uppercase">
                                                    INVENTORY FAMILY / TIER
                                                </h6>
                                                <h5 className="text-capitalize">
                                                    {" "}
                                                    <Breadcrumb
                                                        separator={
                                                            <img
                                                                src={Images.arrow_small_breadcrumb}
                                                                alt={""}
                                                                className="img-fluid"
                                                            />
                                                        }
                                                    >
                                                        {inventory.breadcrumb.map((name) => {
                                                            return (
                                                                <Breadcrumb.Item key={name}>
                                                                    <Link>{name}</Link>
                                                                </Breadcrumb.Item>
                                                            );
                                                        })}
                                                    </Breadcrumb>
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                            <Panel
                                header={
                                    <div
                                        className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                        <span>Unit Converter</span>
                                        {/* <Button
                                        onClick={() => history.push(reverse(routes.dashboard.management.inventory.inventory_items.edit, {id: this.props.match.params.id}))}
                                        className="edit-btn-summary">
                                        <img src={Images.pencil_green} alt="" className="img-fluid"/>
                                        Edit
                                    </Button> */}
                                    </div>
                                }
                                key="2"
                            >
                                <UnitConverterInventory inventory={inventory}/>
                            </Panel>
                            <Panel
                                header={
                                    <div
                                        className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                    <span>
                      Universal Units of Measurement <sup>*</sup>
                    </span>
                                        <Button
                                           onClick={() =>
                                            history.push({
                                              pathname: reverse(routes.dashboard.management.inventory.inventory_items.edit,
                                                { id: this.props.match.params.id }
                                              ),
                                              editTab: "2"
                                            })
                                          }
                                            className="edit-btn-summary"
                                        >
                                            <img
                                                src={Images.pencil_green}
                                                alt=""
                                                className="img-fluid"
                                            />
                                            Edit
                                        </Button>
                                    </div>
                                }
                                key="3"
                            >
                                <UniversalMeasurementInVentoryView inventory={inventory}/>
                            </Panel>
                            <Panel
                                header={
                                    <div
                                        className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                        <span>Custom Units of Measurement</span>
                                        <Button
                                           onClick={() =>
                                            history.push({
                                              pathname: reverse(routes.dashboard.management.inventory.inventory_items.edit,
                                                { id: this.props.match.params.id }
                                              ),
                                              editTab: "3"
                                            })
                                          }
                                            className="edit-btn-summary"
                                        >
                                            <img
                                                src={Images.pencil_green}
                                                alt=""
                                                className="img-fluid"
                                            />
                                            Edit
                                        </Button>
                                    </div>
                                }
                                key="4"
                            >
                                <CustomUnitMeasurementsInventoryView
                                    {...this.props}
                                    inventory={inventory}
                                />
                            </Panel>
                            <Panel
                                header={
                                    <div
                                        className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                    <span>
                      Unit Price <sup>*</sup>
                    </span>
                                        <Button
                                            onClick={() =>
                                                history.push({
                                                  pathname: reverse(routes.dashboard.management.inventory.inventory_items.edit,
                                                    { id: this.props.match.params.id }
                                                  ),
                                                  editTab: "4"
                                                })
                                              }
                                            className="edit-btn-summary"
                                        >
                                            <img
                                                src={Images.pencil_green}
                                                alt=""
                                                className="img-fluid"
                                            />
                                            Edit
                                        </Button>
                                    </div>
                                }
                                key="5"
                            >
                                <div className="row summary-collapse-inner-row-main">
                                    <div className="col-12">
                                        {inventory ?
                                            <div className="row">
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                    <h6 className="text-uppercase">Unit Of Measurement</h6>
                                                    <h5>
                                                        {inventory?.uom ? `${inventory?.uom?.name} (${inventory?.uom?.symbol})` :
                                                            "-"}
                                                    </h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                    <h6 className="text-uppercase">Estimated Unit Cost</h6>
                                                    <h5>
                                                        {formatMoney(inventory.unit_cost || "-")}{inventory?.uom && '/'}
                                                        {inventory?.uom?.symbol}
                                                    </h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                    <h6 className="text-uppercase">Margin</h6>
                                                    <h5 className="text-capitalize">
                                                        {" "}
                                                        {inventory.margin || "-"} %
                                                    </h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                    <h6 className="text-uppercase">Price</h6>
                                                    <h5>
                                                        ${calculatePercentage(inventory?.unit_cost, inventory?.margin) == 0 ? " -" : calculatePercentage(inventory?.unit_cost, inventory?.margin)}{inventory?.uom && '/'}
                                                        {inventory?.uom?.symbol}
                                                    </h5>
                                                </div>
                                            </div>
                                            :
                                            <div className="col-12">
                                                <div
                                                    className="row mx-0 mb-0 mt-3 no-data-card-row align-items-center bg-transparent justify-content-center">
                                                    <div className="col-12 text-center">
                                                        <img
                                                            alt={""}
                                                            className="img-fluid"
                                                            src={Images.billing_empty_state_icon}
                                                        />
                                                        <h6 className="mb-0">No Unit Price</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </Panel>
                            <Panel
                                header={
                                    <div
                                        className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                        <span>
                                        Warehouses <sup>*</sup>
                                        </span>
                                        <Button
                                           onClick={() =>
                                            history.push({
                                              pathname: reverse(routes.dashboard.management.inventory.inventory_items.edit,
                                                { id: this.props.match.params.id }
                                              ),
                                              editTab: "5"
                                            })
                                          }
                                            className="edit-btn-summary"
                                        >
                                            <img
                                                src={Images.pencil_green}
                                                alt=""
                                                className="img-fluid"
                                            />
                                            Edit
                                        </Button>
                                    </div>
                                }
                                key="6"
                            >
                                <InternalLocationView {...this.props} inventory={inventory}/>
                            </Panel>
                            <Panel
                                header={
                                    <div
                                        className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                        <span>Vendors</span>
                                        <Button
                                            onClick={() =>
                                                history.push({
                                                  pathname: reverse(routes.dashboard.management.inventory.inventory_items.edit,
                                                    { id: this.props.match.params.id }
                                                  ),
                                                  editTab: "6"
                                                })
                                              }
                                            className="edit-btn-summary"
                                        >
                                            <img
                                                src={Images.pencil_green}
                                                alt=""
                                                className="img-fluid"
                                            />
                                            Edit
                                        </Button>
                                    </div>
                                }
                                key="7"
                            >
                                <VendorView {...this.props} inventory={inventory}/>
                            </Panel>
                            <Panel
                                header={
                                    <div
                                        className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                        <span>Inventory Kits</span>
                                    </div>
                                }
                                key="9"
                            >
                                <InventoryKitView {...this.props} />
                            </Panel>
                            <Panel
                                header={
                                    <div
                                        className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                        <span>Documents</span>
                                    </div>
                                }
                                key="8"
                            >
                                <DocumentsView {...this.props} showBtn={true}/>
                            </Panel>
                        </Collapse>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, {setBreadcrumb})(withRouter(SummaryInfo));
