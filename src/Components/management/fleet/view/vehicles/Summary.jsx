import React, {Component} from "react";
import {Button, Collapse, Form, Input, Select, Spin} from "antd";
import {Image as Images} from "../../../../Images";
import {CaretRightOutlined} from "@ant-design/icons";
import {getVehicleById} from "../../../../../Controller/api/vehicleServices";
import {handleError} from "../../../../../Controller/Global";
import {withRouter} from "react-router-dom";
import {history} from "../../../../../Controller/history";
import {reverse} from "named-urls/dist/index.es";
import {routes} from "../../../../../Controller/Routes";
import {connect} from "react-redux";
import {setBreadcrumb} from "../../../../../Store/actions/breadcrumbAction";
import {formatMoney, formatPhone} from "../../../../../Controller/utils";
import VehicleDocs from "./VehicleDocs";

const {Panel} = Collapse;
const {Option, OptGroup} = Select;

class Summary extends Component {
    state = {
        data: [],
        loading: false,
        pagination: {
            current: 1,
            pageSize: 15,
        },
        visible: false,
        vehicle: null,
    };
    showAddVehicles = (visible) => {
        this.setState({
            visible: visible,
        });
    };

    componentDidMount() {
        if (this.props.match.params.id) {
            getVehicleById(this.props.match.params.id)
                .then((res) => {
                    let arrVehicle = [
                        {
                            title: "Fleet",
                            url: routes.dashboard.management.fleet.self,
                        },
                        {
                            title: "Vehicles",
                            url: routes.dashboard.management.fleet.self,
                        },
                        {
                            title: res.data.name,
                            url: "#",
                        },
                    ];
                    this.props.setBreadcrumb(arrVehicle);
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
                            res.data.average_price / res.data.average_gallon || 0
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
                    this.setState({vehicle: {...res.data, ...calculated, total}});
                })
                .catch((err) => {
                    handleError(err);
                });
        }
    }

    render() {
        const internal_location = this.state.vehicle?.internal_location;
        let {vehicle} = this.state;
        if (!vehicle) {
            return (
                <div className="text-center my-4">
                    <Spin/>
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
                                                //             routes.dashboard.management.fleet.vehicle.edit,
                                                //             {id: this.props.match.params.id}
                                                //         )
                                                //     )
                                                // }
                                                onClick={() =>
                                                    history.push({
                                                      pathname: reverse(routes.dashboard.management.fleet.vehicle.edit,
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
                                                    <h6 className="text-uppercase">STATUS</h6>
                                                    <h5 className="mb-0">{vehicle?.status || "-"}</h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                                                    <h6 className="text-uppercase">Current Operator</h6>
                                                    <h5 className="mb-0">
                                                        {vehicle?.operator?.first_name || "-"}
                                                    </h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                                                    <h6 className="text-uppercase">Vehicle ID</h6>
                                                    <h5 className="mb-0">{vehicle?.id || "-"}</h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                                                    <h6 className="text-uppercase">Vehicle Name</h6>
                                                    <h5 className="mb-0">{vehicle?.name || "-"}</h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                                                    <h6 className="text-uppercase">Fleet Group Name </h6>
                                                    <h5 className="mb-0">
                                                        {vehicle?.fleet_group?.name || "-"}
                                                    </h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt offset-lg-3">
                                                    <h6 className="text-uppercase">Region </h6>
                                                    <h5 className="mb-0">{vehicle?.region || "-"}</h5>
                                                </div>
                                                {/* <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                                                    <h6 className="text-uppercase">Vehicle </h6>
                                                    <h5 className="mb-0">{vehicle?.vehicle || "-"}</h5>
                                                </div> */}
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                                                    <h6 className="text-uppercase">Year </h6>
                                                    <h5 className="mb-0">{vehicle?.year || "-"}</h5>
                                                </div>

                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt offset-lg-3">
                                                    <h6 className="text-uppercase">Make </h6>
                                                    <h5 className="mb-0">{vehicle?.make || "-"}</h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                                                    <h6 className="text-uppercase">Model </h6>
                                                    <h5 className="mb-0">{vehicle?.make || "-"}</h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                                                    <h6 className="text-uppercase">Trim </h6>
                                                    <h5 className="mb-0">{vehicle?.trim || "-"}</h5>
                                                </div>

                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3 offset-lg-3">
                                                    <h6 className="text-uppercase">Color </h6>
                                                    <h5 className="mb-0">{vehicle?.color || "-"}</h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                    <h6 className="text-uppercase">Type </h6>
                                                    <h5 className="mb-0 text-capitalize">
                                                        {vehicle?.type?.toLowerCase() || "-"}
                                                    </h5>
                                                </div>
                                                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                    <h6 className="text-uppercase">Fuel Type </h6>
                                                    <h5 className="mb-0 text-capitalize">
                                                        {vehicle?.fuel_type
                                                            ?.split("_")
                                                            .join(" ")
                                                            .toLowerCase() || "-"}
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
                                            <span>Vehicle Calculations</span>
                                            <Button
                                               // }
                                               onClick={() =>
                                                history.push({
                                                  pathname: reverse(routes.dashboard.management.fleet.vehicle.edit,
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
                                    key="7"
                                >
                                    <div className="col-12">
                                        <div
                                            className="row new-opportunity-header-row summary-header-details search-view-header-in-collapse align-items-center carpet-cleaning-mini-header">
                                            <div className="col-12">
                                                <div className="row pt-2 pb-1">
                                                    <div className="total_cost_per">Total Cost Per Day</div>
                                                    <div className="total_cost_per_count">
                                                        {formatMoney(vehicle.total || "0")}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="row pt-1 pb-2">
                                                    <div className="total_cost_per">Total Cost Per Hour</div>
                                                    <div className="total_cost_per_count">
                                                         {`$ ${parseFloat(formatMoney((vehicle.total / vehicle.average_hours) || "0").slice(1)).toFixed(2)}`}
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
                                                            {formatMoney(vehicle.per_day_dpr || "0")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Estimated Days of Use per Year *
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.estimated_days || "-"}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Estimated Life (Years){" "}
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.estimated_life || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Average Hours per Day{" "}
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.average_hours || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4">
                                                        <h6 className="text-uppercase">Purchase Cost </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.purchase_cost || "0")}
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
                                                            {formatMoney(vehicle.insurance_per_day || "0")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Annual Auto Insurance Premium{" "}
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.annual_permium || "-"}
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
                                                                    Fuel Per Day{" "}
                                                                </h6>
                                                                <h5 className="mb-3">
                                                                    {formatMoney(vehicle.fuel_per_day || "0")}
                                                                </h5>
                                                            </div>
                                                            <div className="col-12">
                                                                <h6 className="text-uppercase">
                                                                    Average Gallons per Day *
                                                                </h6>
                                                                <h5 className="mb-0">
                                                                    {vehicle.average_gallon || "-"}
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Average Fuel Price per Gallon{" "}
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.average_price || "0")}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5>Registration Cost</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Registration Per Day
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.reg_per_day || "0")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Annual Registration Fee
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.annual_fee || "0")}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5>Permit Cost</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">Permit Per Day</h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.permit_per_day || "0")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Annual Permit Fee{" "}
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.annual_permit_fee || "0")}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5>Maintenance Cost</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Maintenance Per Day
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.maintenance_per_day || "0")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Maintenance per Year{" "}
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.maintenance_per_year || "0")}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="row summary-view-row-vehicle border-0">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5>Other Cost</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">Other Per Day</h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.other_cost_per_day || "0")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">Other per Year </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.other_cost_per_year || "0")}
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
                      <span>
                        Warehouse <sup>*</sup>
                      </span>
                                            <Button
                                                onClick={() =>
                                                    history.push({
                                                      pathname: reverse(routes.dashboard.management.fleet.vehicle.edit,
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
                                    key="8"
                                >
                                    <div className="row mx-0">
                                        <div className="col-12">
                                            <div className="row summary-collapse-inner-row-main px-0">
                                                <div className="col-12">
                                                    { vehicle.internal_location ?
                                                         <div key={internal_location?.id} className="row site-details-row-card position-relative">
                                                            <div className="col-12 col-sm-3">
                                                                <div className="site-name-location">
                                                                    <img
                                                                        src={Images.location_gray}
                                                                        alt=""
                                                                        className="img-fluid"
                                                                    />
                                                                    <span>{internal_location?.name}</span>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-sm-3">
                                                                <h6 className="text-uppercase">ADDRESS</h6>
                                                                <p className="mb-0">{`${internal_location?.street_address} ${internal_location?.name} ${internal_location?.city} ${internal_location?.state} ${internal_location?.country}`}</p>
                                                            </div>
                                                            <div className="col-12 col-sm-3">
                                                                <h6 className="text-uppercase">EMAIL ADDRESS</h6>
                                                                <p className="mb-0">{internal_location?.email}</p>
                                                            </div>
                                                            <div className="col-12 col-sm-3">
                                                                <h6 className="text-uppercase">PHONE NUMBER</h6>
                                                                <p className="mb-0">
                                                                    {formatPhone(internal_location?.phone)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div
                                                            className="row mx-0 no-data-card-row bg-transparent align-items-center justify-content-center">
                                                            <div className="col-12 text-center">
                                                                <img alt={""} className="img-fluid"
                                                                     src={Images.location_gray}/>
                                                                <h6 className="mb-0">No Warehouse</h6>
                                                            </div>
                                                        </div>
                                                     }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Panel>

                                <Panel
                                    header={
                                        <div
                                            className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                            <span>Registration Information</span>
                                            <Button
                                                onClick={() =>
                                                    history.push({
                                                      pathname: reverse(routes.dashboard.management.fleet.vehicle.edit,
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
                                    key="2"
                                >
                                    <div className="col-12">
                                        <div className="row summary-collapse-inner-row-main">
                                            <div className="col-12">
                                                <div className="row">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                        <h6 className="text-uppercase">VIN/SN</h6>
                                                        <h5 className="mb-0">{vehicle.vin_sin || "-"}</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                        <h6 className="text-uppercase">License Plate</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.license_plate || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                        <h6 className="text-uppercase">
                                                            Registration State/Province{" "}
                                                        </h6>
                                                        <h5 className="mb-0">CT</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                        <h6 className="text-uppercase">Ownership *</h6>
                                                        <h5 className="mb-0">{vehicle.ownership || "-"}</h5>
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
                      <span>
                        Metrics <sup>*</sup>
                      </span>
                                            <Button
                                               onClick={() =>
                                                history.push({
                                                  pathname: reverse(routes.dashboard.management.fleet.vehicle.edit,
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
                                    key="3"
                                >
                                    <div className="col-12">
                                        <div className="row summary-collapse-inner-row-main">
                                            <div className="col-12">
                                                <div className="row">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                        <h6 className="text-uppercase">
                                                            Current Meter Unit
                                                        </h6>
                                                        <h5 className="mb-0 text-capitalize">
                                                            {vehicle.current_meter_unit?.name
                                                                ?.toLowerCase()
                                                                .split("_")
                                                                .join(" ") || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                        <h6 className="text-uppercase">
                                                            Secondary Meter Unit
                                                        </h6>
                                                        <h5 className="mb-0 text-capitalize">
                                                            {vehicle.secondary_meter_unit?.name
                                                                ?.toLowerCase()
                                                                .split("_")
                                                                .join(" ") || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                        <h6 className="text-uppercase">Fuel Volume Unit</h6>
                                                        <h5 className="mb-0 text-capitalize">
                                                            {vehicle.fuel_volume_unit?.name?.toLowerCase() ||
                                                                "-"}
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
                                            <span>Lifetime Costs</span>
                                            <Button
                                                onClick={() =>
                                                    history.push({
                                                      pathname: reverse(routes.dashboard.management.fleet.vehicle.edit,
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
                                    key="4"
                                >
                                    <div className="col-12">
                                        <div className="row summary-collapse-inner-row-main">
                                            <div className="col-12">
                                                <div className="row">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Service Costs (Lifetime)
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.service_cost || "0")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Fuel Costs (Lifetime)
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.fuel_cost || "0")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Other Costs (Lifetime)
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.other_cost || "0")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Meter Usage per Day (Lifetime)
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.meter_uses_per_day || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                        <h6 className="text-uppercase">
                                                            Secondary Meter Usage per Day (Lifetime)
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.secondary_meter_uses_per_day || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                        <h6 className="text-uppercase">Fuel Volume Unit</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.fuel_volume_unit_cost || "-"}
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
                                            <span>Documents</span>
                                            {/* <Button
                                              onClick={() =>
                                                history.push({
                                                  pathname: reverse(routes.dashboard.management.fleet.vehicle.edit,
                                                    { id: this.props.match.params.id }
                                                  ),
                                                  editTab: "9"
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
                                            </Button> */}
                                        </div>
                                    }
                                    key="9"
                                >
                    
                                    <VehicleDocs hideTitle={true}  
                                    onTabChange={this.props.onTabChange}/>
                                </Panel>

                                <Panel
                                    header={
                                        <div
                                            className="opportunity_info-collapse d-flex align-items-center justify-content-between">
                                            <span>Technical Details</span>
                                            <Button
                                              onClick={() =>
                                                history.push({
                                                  pathname: reverse(routes.dashboard.management.fleet.vehicle.edit,
                                                    { id: this.props.match.params.id }
                                                  ),
                                                  editTab: "7"
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
                                    <div className="col-12">
                                        <div className="row summary-collapse-inner-row-main">
                                            <div className="col-12">
                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5 className="mb-0">General</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Body Type</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.body_type || "-"}{" "}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Body Subtype</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.body_sub_type || "-"}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Drive Type</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.drive_type || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">Brake System</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.brake_system || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4">
                                                        <h6 className="text-uppercase">MSRP</h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.msrp || "-")}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5 className="mb-0">Fuel</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Fuel Tank 1 Capacity
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.fuel_tank_1_capacity || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Fuel Tank 2 Capacity
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.fuel_tank_2_capacity || "-"}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">EPA City</h6>
                                                        <h5 className="mb-0">{vehicle.epa_city || "-"}</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">EPA Highway</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.epa_highway || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4">
                                                        <h6 className="text-uppercase">EPA Combined</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.epa_combined || "-"}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5 className="mb-0">Dimensions</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Front Track Width
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.front_track_width || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Ground Clearance</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.ground_clearance || "-"}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Height </h6>
                                                        <h5 className="mb-0">{vehicle.height}</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Length</h6>
                                                        <h5 className="mb-0">{vehicle.length || "-"}</h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Rear Track Width</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.rear_track_width || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">Width</h6>
                                                        <h5 className="mb-0">{vehicle.width || "-"}</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4">
                                                        <h6 className="text-uppercase">Wheelbase</h6>
                                                        <h5 className="mb-0">{vehicle.wheelbase || "-"}</h5>
                                                    </div>
                                                </div>
                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5 className="mb-0">Tires & Wheels</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Front Tire PSI</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.front_tire_psi || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Rear Tire PSI</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.reat_tire_psi || "-"}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Rear Axle </h6>
                                                        <h5 className="mb-0">{vehicle.rear_axle || "-"}</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt"/>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Front Tire Type</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.front_tire_type || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Front Wheel Diameter
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.front_wheel_diameter || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4">
                                                        <h6 className="text-uppercase">Rear Tire Type</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.rear_tire_type || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Rear Wheel Diameter
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.rear_wheel_diameter || "-"}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5 className="mb-0">Weight and Capacity</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Towing Capacity</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.towing_capacity || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Curb Weight</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.curb_weight || "-"}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Gross Vehicle Weight Training
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.gross_vehicle_weight || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Bed Length</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.bed_length || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4">
                                                        <h6 className="text-uppercase">Max Payload</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.max_payload || "-"}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5 className="mb-0">Engine</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Engine Summary</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.engine_summary || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Engine Brand</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.engine_brand || "-"}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Aspiration</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.aspiration || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Block Type</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.block_type || "-"}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Bore</h6>
                                                        <h5 className="mb-0">{vehicle.bore || "-"}</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Cam Type</h6>
                                                        <h5 className="mb-0">{vehicle.cam_type || "-"}</h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Compression</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.compression || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Cylinders</h6>
                                                        <h5 className="mb-0">{vehicle.cylinders || "-"}</h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Fuel Induction</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.fuel_induction || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Fuel Quality</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.fuel_quality || "-"}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Max HP</h6>
                                                        <h5 className="mb-0">{vehicle.max_hp || "-"}</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Max Torque</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.max_torque || "-"}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Oil Capacity</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.oil_capacity || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Redline RPM</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.redline_rpm || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4">
                                                        <h6 className="text-uppercase">Stroke</h6>
                                                        <h5 className="mb-0">{vehicle.stroke || "-"}</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">Valves</h6>
                                                        <h5 className="mb-0">{vehicle.valves || "-"}</h5>
                                                    </div>
                                                </div>
                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5 className="mb-0">Transmission</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Transmission Summary
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.transmission_summary || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Transmission Brand
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.transmission_brand || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Transmission Type
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.transmission_type || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">
                                                            Transmission Gears
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.tranmission_grears || "-"}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5 className="mb-0">Volume</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Cargo Volume</h6>
                                                        <h5 className="mb-0">{vehicle.volume || "-"}</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Interior Volume</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.interior_volume || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4">
                                                        <h6 className="text-uppercase">Passenger Volume</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.passenger_volume || "-"}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="row summary-view-row-vehicle border-0">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5 className="mb-0">Duty Type & Weight Class</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">Duty Type</h6>
                                                        <h5 className="mb-0">{vehicle.duty_type || "-"}</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h6 className="text-uppercase">Weight Class</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.weight_class || "-"}
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
                                            <span>Payment Information</span>
                                            <Button
                                              onClick={() =>
                                                history.push({
                                                  pathname: reverse(routes.dashboard.management.fleet.vehicle.edit,
                                                    { id: this.props.match.params.id }
                                                  ),
                                                  editTab: "8"
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
                                    <div className="col-12">
                                        <div className="row summary-collapse-inner-row-main">
                                            <div className="col-12">
                                                <div className="row summary-view-row-vehicle">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5 className="mb-0">Payment</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Acquisition Type</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.acquisition_type || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Monthly Cost</h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.monthaly_cost || "-")}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Acquisition Date</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.acquisition_date || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Loan Amount</h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.loan_amount || "-")}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Capitalized Cost</h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.capitalized_cost || "-")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Down Payment Amount
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.down_payment_amount || "-")}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Annual Percentage Rate
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.annual_percentage_rate || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            First Payment Date
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.first_payment_date || "-"}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Number of Payments
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.number_of_payment || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Reference Number</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.reference_number || "-"}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Residual Value </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.residual_value || "-")}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt"/>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Mileage Cap</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.mileage_cap || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Mileage Charge</h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.mileage_charge || "-")}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Acquisition End Date
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.acquisition_end_date || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Generate Expenses
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.generate_expenses || "-")}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Vendor Name</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.vendor_name || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Lender Name</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.lender_name || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-12 col-md-8 col-lg-8 offset-lg-4">
                                                        <h6 className="text-uppercase">Notes</h6>
                                                        <h5 className="mb-0">{vehicle.notes || "-"}</h5>
                                                    </div>
                                                </div>
                                                <div className="row summary-view-row-vehicle border-0">
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4">
                                                        <h5 className="mb-0">Purchase & Warranty</h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Purchase Date</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.purchase_date || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Purchase Price</h6>
                                                        <h5 className="mb-0">
                                                            {formatMoney(vehicle.purchase_price || "-")}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Purchase Meter Value
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.purchase_master_value || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Purchase Vendor</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.purchase_vendor || "-"}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-12 col-md-8 col-lg-8 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">Purchase Comment</h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.purchase_comment || "-"}
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="col-12 col-sm-6 col-md-4 col-lg-4 offset-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Warranty Expiration Date
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.warrant_expiration_date || "-"}
                                                        </h5>
                                                    </div>
                                                    <div className="col-12 col-sm-6 col-md-4 col-lg-4 mb-15-bt">
                                                        <h6 className="text-uppercase">
                                                            Warranty Expiration Meter
                                                        </h6>
                                                        <h5 className="mb-0">
                                                            {vehicle.warrant_expiration_meter || "-"}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Panel>

                            </Collapse>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(null, {setBreadcrumb})(withRouter(Summary));
