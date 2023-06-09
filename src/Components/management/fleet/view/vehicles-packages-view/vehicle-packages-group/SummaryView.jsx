import React, {Component} from "react";
import {Breadcrumb, Button, Collapse, Form, Input, Spin, Table} from "antd";
import {Image as Images} from "../../../../../Images";
import {CaretRightOutlined} from "@ant-design/icons";
import AddVehicles from "../../../../../drawers/vehicles/AddVehicles";
import {Link, withRouter} from "react-router-dom";
import {getFleetGroupById, getVehicle,} from "../../../../../../Controller/api/vehicleServices";
import {handleError} from "../../../../../../Controller/Global";
import {routes} from "../../../../../../Controller/Routes";
import {history} from "../../../../../../Controller/history";
import {reverse} from "named-urls/dist/index.es";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../../../../Store/actions/breadcrumbAction";
import {formatMoney} from "../../../../../../Controller/utils";

const {Panel} = Collapse;

class SummaryView extends Component {
    state = {
        data: null,
        visible: false,
        loading: true,
        vehicle: [],
        view: false,
    };
    vehicleColumns = [
        {
            title: "VEHICLE ID",
            dataIndex: "id",
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: "VEHICLE NAME",
            dataIndex: "name",
            sorter: (a, b) => a.id - b.id,
            
        },
        {
            title: "WAREHOUSE",
            dataIndex: "internal_location",
            sorter: true,
            render: (location) => (
                <div className="d-flex align-items-center">
                <span>{location?.name}</span>
            </div> 
            )
        },
        {
            title: "STATUS",
            dataIndex: "status",
            sorter: true,
        },
        {
            title: "VEHICLE GROUP",
            dataIndex: "fleet_group",
            sorter: true,
            render: (fleet) => (
                <div className="d-flex align-items-center">
                    <span>{fleet.name}</span>
                </div>
            ),
        },
    ];
    showAddVehicles = (visible) => {
        this.setState({
            visible: visible,
        });
    };

    componentDidMount() {
        this.setState({loading: true});
        getFleetGroupById(this.props.match.params.id)
            .then((res) => {
                let arrGroup = [
                    {
                        title: "Fleet",
                        url: routes.dashboard.management.fleet.self,
                    },
                    {
                        title: "Fleet Groups",
                        url: routes.dashboard.management.fleet.self,
                    },
                    {
                        title: res.data.name,
                        url: "#",
                    },
                ];
                this.props.setFleetGroup(res.data)
                this.props.setBreadcrumb(arrGroup);
                let calculated = {
                    per_day_dpr: (
                        res.data.purchase_cost /
                        res.data.estimated_life /
                        res.data.estimated_days || 0
                    ).toFixed(2),
                    insurance_per_day: (
                        res.data.annual_premium / res.data.estimated_days || 0
                    ).toFixed(2),
                    fuel_per_day: (
                        res.data.average_price * res.data.average_gallon || 0
                    ).toFixed(2),
                    reg_per_day: (
                        res.data.annual_fee / res.data.estimated_days || 0
                    ).toFixed(2),
                    permit_per_day: (
                        res.data.annual_permit_fee / res.data.estimated_days || 0
                    ).toFixed(2),
                    maintenance_per_day: (
                        res.data.maintenance_per_year / res.data.estimated_days || 0
                    ).toFixed(2),
                    other_cost_per_day: (
                        res.data.other_cost_per_year / res.data.estimated_days || 0
                    ).toFixed(2),
                };
                let total = Object.keys(calculated)
                    .reduce((sum, key) => sum + parseFloat(calculated[key] || 0), 0)
                    .toFixed(2);
                // console.log(Object.keys(calculated))

                this.setState({
                    data: {...res.data, ...calculated, total},
                    loading: false,
                });
            })
            .catch((err) => {
                handleError(err);
                this.setState({loading: false});
            });
        this.fetchVehicles();
    }

    fetchVehicles = (params = {}) => {
        getVehicle({...params, fleet_group: this.props.match.params.id})
            .then((res) => {
                this.setState({vehicle: res.data.results});
            })
            .catch((err) => {
                handleError(err);
            });
    };

    handleDrawerSuccess = () => {
        this.fetchVehicles();
    };

    render() {
        let {data, loading} = this.state;
        if (loading) {
            return (
                <div className="row">
                    <div className="col-12 text-center">
                        <Spin/>
                    </div>
                </div>
            );
        }
        return (
            <React.Fragment>
                <div className="col-12 mt-30">
                    <div className="row mx-0 summary-info-inner-row">
                        <div className="col-12">
                            <Collapse
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
                        General Information <sup>*</sup>
                      </span>
                                            <Button
                                                // onClick={() =>
                                                //     history.push(
                                                //         reverse(
                                                //             routes.dashboard.management.fleet.groups.edit,
                                                //             {id: this.props.match.params.id}
                                                //         )
                                                //     )
                                                // }
                                                onClick={() =>
                                                    history.push({
                                                      pathname: reverse(routes.dashboard.management.fleet.groups.edit,
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
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                    <h6 className="text-uppercase">Fleet Group Name</h6>
                                                    <h5 className="mb-0">{data?.name}</h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                    <h6 className="text-uppercase">
                                                        Fleet Family / Tier
                                                    </h6>
                                                    <h5 className="mb-0">
                                                        {/* {data?.fleet_family?.name || "-"} */}
                                                        <Breadcrumb
                                                            separator={
                                                                <img
                                                                    src={Images.arrow_small_breadcrumb}
                                                                    alt={""}
                                                                    className="img-fluid"
                                                                />
                                                            }
                                                        >
                                                            {data?.breadcrumb.map((name) => {
                                                                return (
                                                                    <Breadcrumb.Item key={name}>
                                                                        <Link>{name}</Link>
                                                                    </Breadcrumb.Item>
                                                                );
                                                            })}
                                                            <Breadcrumb.Item>
                                                                <Link>{data?.name}</Link>
                                                            </Breadcrumb.Item>
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
                      <span>
                        Fleet Group Calculations <sup>*</sup>
                      </span>
                                            <Button
                                                        onClick={() =>
                                                            history.push({
                                                              pathname: reverse(routes.dashboard.management.fleet.groups.edit,
                                                                { id: this.props.match?.params.id }
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
                                    key="2"
                                >
                                    <div className="col-12">
                                        <div
                                            className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center carpet-cleaning-mini-header">
                                            <div className="col-12">
                                                <div className="row pt-2 pb-1">
                                                    <div className="total_cost_per">Total Cost Per Day</div>
                                                    <div className="total_cost_per_count">
                                                        {formatMoney(data?.total || "0")}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row pt-1 pb-2">
                                                    <div className="total_cost_per">Total Cost Per hour</div>
                                                    <div className="total_cost_per_count">
                                                        {/* {console.log(data.total / data?.average_hours, data.total,)} */}
                                                        {`$ ${parseFloat(formatMoney((data?.total / data?.average_hours) || "0").slice(1)).toFixed(2)}`}
                                                        {/* ${parseFloat(formatMoney((vehicle.total / vehicle.average_hours) || "0").slice(1)).toFixed(2)} */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row summary-collapse-inner-row-main">
                                            <div className="col-12">
                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5>Per Day Depreciation</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Per Day Depr</h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(data?.per_day_dpr || "0")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Estimated Days of Use per Year *
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {data?.estimated_days || "-"}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Estimated Life (Years){" "}
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {data?.estimated_life || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Average Hours per Day{" "}
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {data?.average_hours || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4">
                                                        <h6 className="text-uppercase">Purchase Cost </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(data?.purchase_cost || "0")}
                                                        </h5>
                                                    </div>
                                                </div>

                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5>Insurance Cost</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Insurance per Day
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(data?.insurance_per_day || "0")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Annual Auto Insurance Premium{" "}
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(data?.annual_premium || "0")}
                                                        </h5>
                                                    </div>
                                                </div>

                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5>Fuel Cost</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <h6 className="text-uppercase">
                                                                    Fuel per Day{" "}
                                                                </h6>
                                                                <h5 className="mb-3">
                                                                    {formatMoney(data?.fuel_per_day || "0")}
                                                                </h5>
                                                            </div>
                                                            <div className="col-12">
                                                                <h6 className="text-uppercase">
                                                                    Average Gallons per Day *
                                                                </h6>
                                                                <h5 className="mb-0">
                                                                    {data?.average_gallon || "-"}
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Average Fuel Price per Gallon{" "}
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(data?.average_price || "0")}
                                                        </h5>
                                                    </div>
                                                </div>

                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5>Registration Cost</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Registration per Day
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(data?.reg_per_day || "0")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Annual Registration Fee
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(data?.annual_fee || "0")}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5>Permit Cost</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">Permit per Day</h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(data?.permit_per_day || "0")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Annual Permit Fee{" "}
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(data?.annual_permit_fee || "0")}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5>Maintenance Cost</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Maintenance per Day
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(data?.maintenance_per_day || "0")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Maintenance per Year{" "}
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(data?.maintenance_per_year || "0")}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="row summary-view-row-vehicle border-0">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5>Other Cost</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">Other per Day</h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(data?.other_cost_per_year || "0")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">Other per Year </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(data?.other_cost_per_day || "0")}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Panel>
                                <Panel
                                    header={
                                        <div
                                            className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                            <span>Vehicles</span>
                                        </div>
                                    }
                                    key="3"
                                >
                                    <div className="col-12">
                                        <div
                                            className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center justify-content-between carpet-cleaning-mini-header">
                                            <div className="search-bar-div d-flex align-items-center">
                                                <Form className="position-relative">
                                                    <Input
                                                        onChange={(e) =>
                                                            this.fetchVehicles({search: e.target.value})
                                                        }
                                                        placeholder="Search"
                                                    />
                                                    <Button
                                                        className="search-btn position-absolute p-0 border-0 bg-transparent m-auto">
                                                        <img
                                                            src={Images.search_icon_gray}
                                                            className="img-fluid"
                                                            alt="search icon"
                                                        />
                                                    </Button>
                                                </Form>
                                                <Button
                                                    onClick={() => this.showAddVehicles(true)}
                                                    className="add-btn-collapse ml-2 text-uppercase"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div className="d-flex align-items-center grid-system-div">
                                                    <ul className="mb-0 list-inline">
                                                        <li className="list-inline-item">
                                                            Total : {this.state.vehicle.length}
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <Button
                                                                className={`${this.state.view ? "active" : ""}`}
                                                                onClick={() => this.setState({view: true})}
                                                            >
                                                                <img
                                                                    src={Images.list_view_icon}
                                                                    className="img-fluid img-gray"
                                                                    alt="list view"
                                                                />
                                                                <img
                                                                    src={Images.list_view_icon_active}
                                                                    className="img-fluid img-active"
                                                                    alt="list view"
                                                                />
                                                            </Button>
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <Button
                                                                className={`${
                                                                    !this.state.view ? "active" : ""
                                                                }`}
                                                                onClick={() => this.setState({view: false})}
                                                            >
                                                                <img
                                                                    src={Images.grid_view_icon}
                                                                    className="img-fluid img-gray"
                                                                    alt="grid view"
                                                                />
                                                                <img
                                                                    src={Images.grid_view_icon_active}
                                                                    className="img-fluid img-active"
                                                                    alt="grid view"
                                                                />
                                                            </Button>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <Button
                                                    onClick={() => this.props.handleViewAll("2")}
                                                    className="view-all-btn text-uppercase"
                                                >
                                                    VIEW ALL{" "}
                                                </Button>
                                            </div>
                                        </div>
                                        {this.state.vehicle.length > 0 ? (
                                            !this.state.view ? (
                                                <div className="row mt-4">
                                                    {this.state.vehicle.map((v, k) => (
                                                        <div
                                                            key={k}
                                                            className="col-12 col-sm-6"
                                                            onClick={() =>
                                                                history.push(
                                                                    reverse(
                                                                        routes.dashboard.management.fleet.vehicle
                                                                            .view,
                                                                        {id: v.id}
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            <div
                                                                style={{minHeight: "85px", height: "85px"}}
                                                                className="row mx-0 add-vehicles-main-row align-items-center position-relative"
                                                            >
                                                                <div className="add-vehicles-img float-left">
                                                                    <img
                                                                        src={Images.truck_icon_black}
                                                                        alt={""}
                                                                        className="img-fluid"
                                                                    />
                                                                </div>
                                                                <div className="add-vehicles-content float-left">
                                                                    <h6>{v.name}</h6>
                                                                    <p className="mb-0 text-capitalize">
                                                                        {v.status.toLowerCase()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="col-12 table-responsive main-table-div mt-3">
                                                    <Table
                                                        className=" border-0 carpet-cleaning-table"
                                                        columns={this.vehicleColumns}
                                                        dataSource={this.state.vehicle}
                                                        size="middle"
                                                        pagination={true}
                                                        onRow={(record) => {
                                                            return {
                                                                onClick: () => {
                                                                    if (record) {
                                                                        history.push(
                                                                            reverse(
                                                                                routes.dashboard.management.fleet
                                                                                    .vehicle.view,
                                                                                {id: record.id}
                                                                            )
                                                                        );
                                                                    }
                                                                },
                                                            };
                                                        }}
                                                    />
                                                </div>
                                            )
                                        ) : (
                                            <div className="row mx-0 bg-transparent border-0 no-data-card-row align-items-center justify-content-center">
                                                <div
                                                    // onClick={() =>
                                                    //     history.push(
                                                    //         routes.dashboard.management.fleet.vehicle.create
                                                    //     )
                                                    // }
                                                    className="col-12 text-center"
                                                >
                                                    <img
                                                        src={Images.Truck_empty_state_icon}
                                                        alt=""
                                                        className="img-fluid"
                                                    />
                                                    <h6 className="mb-0">No Vehicles</h6>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Panel>
                            </Collapse>
                        </div>
                    </div>
                </div>
                <AddVehicles
                    visible={this.state.visible}
                    onClose={() => this.showAddVehicles(false)}
                    onSuccess={this.handleDrawerSuccess}
                />
            </React.Fragment>
        );
    }
}

export default connect(null, {setBreadcrumb})(withRouter(SummaryView));
